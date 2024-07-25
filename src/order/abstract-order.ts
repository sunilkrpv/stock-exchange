import { Order } from "./order.interface";

export abstract class AbstractOrder implements Order {

    constructor(public readonly id: number,
        public readonly stockId: string,
        public readonly type: 'buy' | 'sell',
        public readonly price: number,
        public readonly quantity: number,
        public readonly status: "placed" | "fulfilled" | "partial",
        public readonly fullfilledQuantity = 0) {
    }

}