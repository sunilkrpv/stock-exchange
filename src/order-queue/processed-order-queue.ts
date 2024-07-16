
import { EventEmitter } from 'events';
import { SellOrder } from "../order/sell-order";
import { AbstractOrderQueue } from "./abstract-order-queue";
import { AbstractOrder } from "../order/abstract-order";
import { MaxHeap } from "datastructures-js";
import { Order } from '../order/order.interface';


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
export class ProcessedOrderQueue {

    constructor(private eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
        this.eventEmitter.on('matched', this.onMatched.bind(this));
        this.eventEmitter.on('no-match', this.onNoMatch.bind(this));
        this.eventEmitter.on('other', this.onError.bind(this));
    }


    protected onMatched(sellOrder: Order, buyOrders: Order[]) {

    }

    protected onNoMatch(sellOrder: Order) {

    }

    protected onError(sellOrder: Order) {

    }

    

}