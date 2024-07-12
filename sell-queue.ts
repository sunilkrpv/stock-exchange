
import { Queue } from 'data-structure-typed';
import { Order } from './order.interface';

export class SellQueue {

    private readonly q: Queue;

    constructor() {
        this.q = new Queue<Order>();
    }

    add(order: Order) {
        this.q.push(order);
    }
    

}