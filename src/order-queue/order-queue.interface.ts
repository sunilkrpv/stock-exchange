import { AbstractOrder } from "../order/abstract-order";
import { Order } from "../order/order.interface";

export interface OrderQueue {

    enqueue(order: AbstractOrder) : void;
    dequeue(stockId: string) : Order;
    peek(stockId: string): Order;
}