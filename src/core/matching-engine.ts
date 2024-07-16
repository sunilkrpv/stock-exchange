import { DoublyLinkedList } from "datastructures-js";
import { Order } from "../order/order.interface";
import { EventEmitter } from 'events';

/**
 * class: MatchingEngine - accepts an incoming order from the broker.
 * Matches the buy orders with the buy orders and updates the order-processor Queue.
 * 
 */
export class MatchingEngine {

    private readonly eventEmitter: EventEmitter;
    /** 
     * Buyers want at lowest prices, so map the stock-id to corresponding prices the stocks list 
     * eg: AMZN , { { 100: [O1, O2, ..., On] }, { 103: [O4, O6, ..., On] } }
     **/
    protected buyOrderPriceMap: Map<string, Map<number, DoublyLinkedList<Order>>>;
    /** Sellers want higher selling prices, similar to buy order price map */
    protected sellOrderPriceMap: Map<string, Map<number, DoublyLinkedList<Order>>>;


    constructor(eventEmitter: EventEmitter) {

        this.eventEmitter = eventEmitter;
        this.buyOrderPriceMap = new Map<string, Map<number, DoublyLinkedList<Order>>>();
        this.sellOrderPriceMap = new Map<string, Map<number, DoublyLinkedList<Order>>>();
        this.eventEmitter.on('order-new', this.onNewOrder.bind(this));
    }


    /**
     * callback function for every new order placed
     * @param order 
     */
    async onNewOrder(order: Order) {

        console.log(`new order received:${order.id} ${order.stockId} trying to match...`);

        const orderPriceMap = order.type === 'buy' ? this.buyOrderPriceMap : this.sellOrderPriceMap;

        if (!orderPriceMap.has(order.stockId))
            orderPriceMap.set(order.stockId, new Map<number, DoublyLinkedList<Order>>());

        const priceMap = this.buyOrderPriceMap.get(order.stockId);
        if (!priceMap.has(order.price))
            priceMap.set(order.price, new DoublyLinkedList<Order>());

        priceMap.get(order.price).insertLast(order);
    }


    protected doMatch(order: Order) {

        if (order.type === 'sell') return;

        const allSellOrders = this.sellOrderPriceMap.get(order.stockId);
        // check if there is a sell order matching the buy order price
        const matchingSellOrders = allSellOrders.get(order.price);
        if (!matchingSellOrders) {
            this.eventEmitter.emit('no-match', order);
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
                    this.eventEmitter.emit("matched", order, sellOrders);
                    break;
                }

                currNode = currNode.getNext();
            }

            if (order.fullfilledQuantity && order.fullfilledQuantity !== order.quantity) {
                order.status = 'partial';
                this.eventEmitter.emit("matched", order, sellOrders);
            }
        }
        
    }

}