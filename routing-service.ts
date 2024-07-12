import { Queue } from "data-structure-typed";
import { Order } from "./order.interface";

export class RoutingService {

    private readonly buyQ: Queue;
    private readonly sellQ: Queue;

    constructor() {
        this.buyQ = new Queue<Order>();
        this.sellQ = new Queue<Order>();
    }

    add(order: Order) {
        if (order.type === 'buy') {
            this.buyQ.push(order);
        }
        else {
            this.sellQ.push(order);
        }
    }

    dequeueBuy() {
        return this.buyQ.shift();
    }

    dequeueSell() {
        return this.sellQ.shift();
    }
}