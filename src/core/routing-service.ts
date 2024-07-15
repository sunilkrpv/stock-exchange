import { Order } from "../order/order.interface";
import { EventEmitter } from 'events';
import { OrderQueue } from "../order-queue";

/**
 * class: RoutingService - Routes the incoming orders to the BUY or SELL queues.
 * Once the order is placed in the respective queues, an event is emitted for the new order placed
 * with the stock-exchange.
 */
export class RoutingService {

    private readonly buyQ: OrderQueue;
    private readonly sellQ: OrderQueue;
    private readonly eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter, buyQueue: OrderQueue, sellQueue: OrderQueue) {
        this.eventEmitter = eventEmitter;
        this.buyQ = buyQueue;
        this.sellQ = sellQueue
    }

    add(order: Order) {

        console.log(`received new order: ${order.id} ${order.stockId}`);
        if (order.type === 'buy') {
            this.buyQ.enqueue(order);
        }
        else {
            this.sellQ.enqueue(order);
        }
        this.eventEmitter.emit('order-new', order);
    }

}