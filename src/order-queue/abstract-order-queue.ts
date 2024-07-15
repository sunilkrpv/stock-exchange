import { AbstractOrder } from "../order/abstract-order";
import { OrderQueue } from "./order-queue.interface";

export abstract class AbstractOrderQueue implements OrderQueue {

    abstract enqueue(order: AbstractOrder) : void;
    abstract dequeue(stockId: string) : AbstractOrder;
    abstract peek(stockId: string): AbstractOrder;
}