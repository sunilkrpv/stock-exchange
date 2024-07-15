import { EventEmitter } from "stream";
import { BuyOrderQueue } from "./buy-order-queue";
import { OrderQueue } from "./order-queue.interface";
import { SellOrderQueue } from "./sell-order-queue";

export class OrderQueueFactory {

    private constructor() { }

    static create(type: 'buy' | 'sell', eventEmitter: EventEmitter) {

        let q: OrderQueue = null;

        if (type === 'buy') {
            q = new BuyOrderQueue(eventEmitter);
        }
        else {
            q = new SellOrderQueue(eventEmitter);
        }

        return q;
    }
}