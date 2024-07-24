import { DoublyLinkedList } from "datastructures-js";
import { Order } from "../order/order.interface";
import { Kafka, Consumer, Producer } from 'kafkajs';

/**
 * class: MatchingEngine - accepts an incoming order from the broker.
 * Matches the buy orders with the buy orders and updates the order-processor Queue.
 * 
 */
export class MatchingEngine {

    /** 
     * Buyers want at lowest prices, so map the stock-id to corresponding prices the stocks list 
     * eg: AMZN , { { 100: [O1, O2, ..., On] }, { 103: [O4, O6, ..., On] } }
     **/
    protected buyOrderPriceMap: Map<string, Map<number, DoublyLinkedList<Order>>>;
    /** Sellers want higher selling prices, similar to buy order price map */
    protected sellOrderPriceMap: Map<string, Map<number, DoublyLinkedList<Order>>>;

    /** the main consumer that receives the buy|sell orders */
    private orderConsumer: Consumer;
    /** the main producer that informs the status of the orders that are processed */
    private orderProcessedProducer: Producer;


    constructor() {
        this.buyOrderPriceMap = new Map<string, Map<number, DoublyLinkedList<Order>>>();
        this.sellOrderPriceMap = new Map<string, Map<number, DoublyLinkedList<Order>>>();
    }

    async initialize() {
        await Promise.all([
            this.initializeProducer(),
            this.initializeConsumer()
        ]);
    }

    protected async initializeProducer() {

        const kafka = new Kafka({
            clientId: 'stock-exchange',
            brokers: ['localhost:9092']
        });
        this.orderProcessedProducer = kafka.producer({ allowAutoTopicCreation: true });
        await this.orderProcessedProducer.connect().then(() => console.log(`PRODUCER(PROCESSED ORDER) CONNECTED`));
    }

    protected async initializeConsumer() {

        const kafka = new Kafka({
            clientId: 'stock-exchange',
            brokers: ['localhost:9092']
        });
        this.orderConsumer = kafka.consumer({ groupId: 'order-consumer' });
        await this.orderConsumer.connect().then(() => console.log(`CONSUMER(ORDER) CONNECTED`));

        await this.orderConsumer.subscribe({ topics: ['buy', 'sell'] })

        await this.orderConsumer.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                console.log({
                    group: `[${topic}]: PARTITION:${partition}`,
                    key: message.key.toString(),
                    value: message.value.toString()
                });

                await this.onNewOrder(JSON.parse(message.value.toString()));
            }
        });
    }


    /**
     * callback function for every new order placed
     * @param order 
     */
    protected async onNewOrder(order: Order) {

        try {

            console.log(`new ${order.type} order received:${order.id} ${order.stockId} trying to match...`);

            const orderPriceMap = order.type === 'buy' ? this.buyOrderPriceMap : this.sellOrderPriceMap;

            if (!orderPriceMap.has(order.stockId))
                orderPriceMap.set(order.stockId, new Map<number, DoublyLinkedList<Order>>());

            const priceMap = orderPriceMap.get(order.stockId);
            if (!priceMap.has(order.price))
                priceMap.set(order.price, new DoublyLinkedList<Order>());

            priceMap.get(order.price).insertLast(order);

            await this.doMatch(order);
        }
        catch (err) {
            console.log(err);
        }
    }


    protected async doMatch(order: Order) {

        if (order.type === 'sell') return;

        const allSellOrders = this.sellOrderPriceMap.get(order.stockId);
        // check if there is a sell order matching the buy order price
        const matchingSellOrders = allSellOrders.get(order.price);
        if (!matchingSellOrders) {

            await this.orderProcessedProducer.send({
                topic: 'no-match',
                messages: [{
                    key: order.stockId,
                    value: JSON.stringify(order)
                }]
            });
            return;
        }
        else {

            const sellOrders: Order[] = [];
            let currNode = matchingSellOrders.head();
            while (currNode) {

                const currSellOrder = currNode.getValue() as Order;
                sellOrders.push(currSellOrder);

                if (order.quantity < currSellOrder.quantity) {

                    // the buy order quantity can be fulfilled buy the current sell order fully
                    order.fullfilledQuantity += order.quantity;
                    currSellOrder.fullfilledQuantity -= order.quantity;;
                }
                else if (order.quantity > currSellOrder.quantity) {

                    // the buy order quantity can be fulfilled buy the current sell order partially
                    order.fullfilledQuantity += currSellOrder.quantity;
                    currSellOrder.fullfilledQuantity -= currSellOrder.quantity;
                    currSellOrder.status = 'fulfilled';
                }
                else {

                    // the buy order quantity can be fulfilled by the current sell order exactly
                    order.fullfilledQuantity += order.quantity;
                    currSellOrder.fullfilledQuantity -= currSellOrder.quantity;
                    currSellOrder.status = 'fulfilled';
                }

                if (order.fullfilledQuantity === order.quantity) {
                    order.status = 'fulfilled';
                    await this.orderProcessedProducer.send({
                        topic: 'matched',
                        messages: [{
                            key: order.stockId,
                            value: JSON.stringify(order)
                        }]
                    });
                    break;
                }

                currNode = currNode.getNext();
            }

            if (order.fullfilledQuantity && order.fullfilledQuantity !== order.quantity) {
                order.status = 'partial';
                await this.orderProcessedProducer.send({
                    topic: 'matched',
                    messages: [{
                        key: order.stockId,
                        value: JSON.stringify(order)
                    }]
                });
            }
        }

    }

}