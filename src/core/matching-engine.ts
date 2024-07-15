import { Order } from "../order/order.interface";
import { EventEmitter } from 'events';

/**
 * class: MatchingEngine - accepts an incoming order from the broker.
 * Matches the buy orders with the buy orders and updates the order-processor Queue.
 * 
 */
export class MatchingEngine {

    private readonly eventEmitter: EventEmitter;
    /** Buyers want at lowest prices, so map the stock-id and the prices in the increasing order */
    protected buyMap: Map<string, LinkedListQueue>
    /** Sellers want higher selling prices, map the stock-id and the prices in the decreasing order */
    protected sellMap: Map<string, LinkedListQueue>

    protected buyOrders: MinHeap<Order> = null;
    protected sellOrders: MaxHeap<Order> = null;

    constructor(eventEmitter: EventEmitter) {

        this.buyMap = new Map<string, LinkedListQueue<Order>>();
        this.sellMap = new Map<string, LinkedListQueue<Order>>();

        this.buyOrders = new MinHeap<Order>(null, {
            comparator: (a: Order, b: Order) => {
                return a.price - b.price;
            }
        });
        this.sellOrders = new MaxHeap<Order>(null, {
            comparator: (a: Order, b: Order) => {
                return b.price - a.price;
            }
        });

        this.eventEmitter = eventEmitter;
        this.eventEmitter.on('order-new', this.onNewOrder.bind(this));
    }


    /**
     * callback function for every new order placed
     * @param order 
     */
    async onNewOrder(order: Order) {

        console.log(`matching new order: ${order.id} ${order.stockId}`);

        if (order.type === 'sell') {
            if (!this.sellMap.has(order.stockId))
                this.sellMap.set(order.stockId, new LinkedListQueue<Order>());

            this.sellMap.get(order.stockId).push(order);

            this.sellOrders.add(order);
        }
        else {
            if (!this.buyMap.has(order.stockId))
                this.buyMap.set(order.stockId, new LinkedListQueue<Order>());

            this.buyMap.get(order.stockId).push(order);

            this.buyOrders.add(order);

            //this.fullfillOrder(order);
        }

        // for the incoming order, check if there is an option for trade

    }

    protected maxComparator(a: Order, b: Order) {

        return a.price > b.price;
    }

    protected fulfillOrder(order: Order) {

        /* if (order.type === 'sell') {
            return;
        }


        // the order is to buy, check in the sellQ if there are any orders that can be fullfilled
        const availableStocks = this.sellMap.get(order.stockId);
        for (const sellorder of availableStocks.values()) {

            console.log(`checking match BUY:[id:${order.id} qty:${order.quantity} price:${order.price}] SELL:[id:${sellorder.id} qty:${sellorder.quantity} price:${sellorder.price}]`);
            // check if the sellers's price matches with buyer's price
            if (order.price >= sellorder.price && sellorder.status !== 'fulfilled') {

                this.eventEmitter.emit('order-matched', order, sellorder);
                break;
            }
        } */


        while (true) {

            const highestBuy = this.buyOrders.peek();
            const lowestSell = this.sellOrders.peek();

            if (!highestBuy || !lowestSell) {
                break;
            }

            if (highestBuy.price >= lowestSell.price) {
                this.buyOrders.delete(highestBuy)!;
                this.sellOrders.delete(lowestSell)!;

                const quantityMatched = Math.min(highestBuy.quantity, lowestSell.quantity);
                console.log(`Matched ${quantityMatched} units at price ${lowestSell.price}`);

                if (buyOrder.quantity > quantityMatched) {
                    buyOrder.quantity -= quantityMatched;
                    this.buyOrders.insert(buyOrder);
                }

                if (sellOrder.quantity > quantityMatched) {
                    sellOrder.quantity -= quantityMatched;
                    this.sellOrders.insert(sellOrder);
                }

            }
            else {
                break;
            }

        }
    }

    fulfillOrders() {

        // pull all the buy orders for all stocks and execute
        for (const stockId of this.buyMap.keys()) {

            console.log(`fulfill orders for stock:${stockId}`);

            const buyOrders = this.buyMap.get(stockId);
            buyOrders.forEach((order) => {
                this.fulfillOrder(order);
            });

        }
    }

    print() {

        for (const [k, v] of this.buyMap.entries()) {
            console.log(`${k}`, v)
        }

        //console.log(this.sellMap.values())
    }
}