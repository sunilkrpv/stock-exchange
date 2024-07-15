
import { EventEmitter } from 'events';
import { SellOrder } from "../order/sell-order";
import { AbstractOrderQueue } from "./abstract-order-queue";
import { AbstractOrder } from "../order/abstract-order";
import { MaxHeap } from "datastructures-js";


/**
 * @class ProcessedOrderQueue - class that receives buy orders that are to be processed.
 * Buy orders are received from the {@link MatchingEngine} after it matches a buy order with 
 * a sell order.
 * 
 * Sell Orders maybe either "matched", "no-match" or "other".
 * 
 * matched - there is a sell order that is matched with a particular buy order
 * 
 * no-match - the buy order cannot be matched with any sell order
 * 
 * other - unable to process the buy order
 */
export class ProcessedOrderQueue extends AbstractOrderQueue {


    /** sellOrders is a map of <stockId, orders(max heap)> */
    protected sellOrders: Map<string, MaxHeap<SellOrder>> = null;

    constructor(private eventEmitter: EventEmitter) {

        super();

        this.sellOrders = new Map<string, MaxHeap<SellOrder>>();
    }

    enqueue(order: AbstractOrder): void {

        if (!this.sellOrders.has(order.stockId)) {

            this.sellOrders.set(order.stockId, new MaxHeap<SellOrder>((o) => o.price));
        }

        this.sellOrders.get(order.stockId).insert(order);
    }

    /**
     * Peeks the value of the highest priced stock
     * @param stockId 
     * @returns 
     */
    peek(stockId: string) {

        if (!this.sellOrders.has(stockId)) {
            return null;
        }

        return this.sellOrders.get(stockId).root();
    }

    /**
     * Returns the highest priced stock if found based on the stockId
     * null if not found
     * @param stockId - id of the stock 
     * @returns 
     */
    dequeue(stockId: string) {

        if (!this.sellOrders.has(stockId)) {
            return null;
        }

        return this.sellOrders.get(stockId).extractRoot();
    }

    /**
     * Returns the lowest priced stock if found based on the stockId
     * null if not found
     * @param stockId - id of the stock 
     * @returns 
     */
    min(stockId: string) {

        if (!this.sellOrders.has(stockId)) {
            return null;
        }

        // the minimum stock price is placed at the leaf
        return this.sellOrders.get(stockId).leaf();
    }

}