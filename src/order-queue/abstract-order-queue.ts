import { AbstractOrder } from "../order/abstract-order";
import { Order } from "../order/order.interface";
import { OrderQueue } from "./order-queue.interface";

export abstract class AbstractOrderQueue implements OrderQueue {

    abstract enqueue(order: AbstractOrder) : void;
    abstract dequeue(stockId: string) : Order;
    abstract peek(stockId: string): Order;
}