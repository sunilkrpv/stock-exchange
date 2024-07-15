import { AbstractOrder } from "../order/abstract-order";

export interface OrderQueue {

    enqueue(order: AbstractOrder) : void;
    dequeue(stockId: string) : AbstractOrder;
    peek(stockId: string): AbstractOrder;
}