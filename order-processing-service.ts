import EventEmitter from "events";
import { Order } from "./order.interface";

export class OrderProcessingService {

    private readonly eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {

        this.eventEmitter = eventEmitter;
        this.eventEmitter.on('order-matched', this.orderMatched.bind(this));
        this.eventEmitter.on('order-no-match', this.orderNoMatch.bind(this));
    }

    protected orderMatched(buyOrder: Order, sellOrder: Order) {

        console.log(`order matched BUY:[id:${buyOrder.id} qty:${buyOrder.quantity} price:${buyOrder.price}] SELL:[id:${sellOrder.id} qty:${sellOrder.quantity} price:${sellOrder.price}]`);

        if (buyOrder.quantity === sellOrder.quantity) {
            buyOrder.status = sellOrder.status = 'fulfilled';
            buyOrder.fullfilledQuantity = buyOrder.quantity;
            sellOrder.fullfilledQuantity = sellOrder.quantity;
        }
        // order partial
        else if (buyOrder.quantity > sellOrder.quantity) {
            buyOrder.status = "partial";
            sellOrder.status = 'fulfilled';
            buyOrder.fullfilledQuantity = sellOrder.quantity;
            sellOrder.fullfilledQuantity = sellOrder.quantity;
            // place the partial order to respective queue back
        }
        else {
            buyOrder.status = "fulfilled";
            sellOrder.status = 'partial';
            buyOrder.fullfilledQuantity = buyOrder.quantity;
            sellOrder.fullfilledQuantity = buyOrder.quantity;
            // place the partial order to respective queue back
        }
    }

    protected orderNoMatch(buyOrder: Order) {

        // place it back to the buy-queue
    }
}