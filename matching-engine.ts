import { LinkedListQueue, MaxHeap, MinHeap } from "data-structure-typed";
import { Order } from "./order.interface";
import { EventEmitter } from 'events';

/**
 * Class that accepts an order and matches the sell and by orders
 */
export class MatchingEngine {

    private readonly eventEmitter: EventEmitter;
    /** Buyers want at lowest prices, so map the stock-id and the prices in the increasing order */
    protected buyMap: Map<string, LinkedListQueue>
    /** Sellers want higher selling prices, map the stock-id and the prices in the decreasing order */
    protected sellMap: Map<string, LinkedListQueue>

    constructor(eventEmitter: EventEmitter) {

        this.buyMap = new Map<string, LinkedListQueue<Order>>();
        this.sellMap = new Map<string, LinkedListQueue<Order>>();
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
        }
        else {
            if (!this.buyMap.has(order.stockId))
                this.buyMap.set(order.stockId, new LinkedListQueue<Order>());

            this.buyMap.get(order.stockId).push(order);

            //this.fullfillOrder(order);
        }

        // for the incoming order, check if there is an option for trade

    }

    protected fulfillOrder(order: Order) {

        if (order.type === 'sell') {
            return;
        }


        // the order is to buy, check in the sellQ if there are any orders that can be fullfilled
        const availableStocks = this.sellMap.get(order.stockId);
        for (const sellorder of availableStocks.values()) {

            console.log(`checking if buy order:${order} can be fullfilled sell order:${sellorder}`);
            // check if the sellers's price matches with buyer's price
            if (order.price >= sellorder.price && sellorder.status !== 'fulfilled') {

                this.eventEmitter.emit('order-matched', order, sellorder);
                break;
            }
        }

    }

    fulfillOrders() {

        let s = new Sorted

        // the order is to buy, check in the sellQ if there are any orders that can be fullfilled
        const availableStocks = this.sellMap.get(order.stockId);
        for (const sellorder of availableStocks.values()) {

            console.log(`checking if buy order:${order} can be fullfilled sell order:${sellorder}`);
            // check if the sellers's price matches with buyer's price
            if (order.price >= sellorder.price && sellorder.status !== 'fulfilled') {

                this.eventEmitter.emit('order-matched', order, sellorder);
                break;
            }
        }
    }

    print() {

        for (const [k, v] of this.buyMap.entries()) {
            console.log(`${k}`, v)
        }
        
        //console.log(this.sellMap.values())
    }
}