import { Queue } from "data-structure-typed";
import { Order } from "./order.interface";
import { EventEmitter } from 'events';

/**
 * class: RoutingService - Routes the incoming orders to the BUY or SELL queues.
 * Once the order is placed in the respective queues, an event is emitted for the new order placed
 * with the stock-exchange.
 */
export class RoutingService {

    private readonly buyQ: Queue;
    private readonly sellQ: Queue;
    private readonly eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.buyQ = new Queue<Order>();
        this.sellQ = new Queue<Order>();
        this.eventEmitter = eventEmitter;
    }

    add(order: Order) {

        console.log(`received new order: ${order.id} ${order.stockId}`);
        if (order.type === 'buy') {
            this.buyQ.push(order);
        }
        else {
            this.sellQ.push(order);
        }
        this.eventEmitter.emit('order-new', order);
    }

    dequeueBuy() {
        return this.buyQ.shift();
    }

    dequeueSell() {
        return this.sellQ.shift();
    }
}