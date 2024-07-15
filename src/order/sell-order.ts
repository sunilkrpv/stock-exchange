import { AbstractOrder } from "./abstract-order";

export class SellOrder extends AbstractOrder {

    constructor(public readonly id: number,
        public readonly stockId: string,
        public readonly price: number,
        public readonly quantity: number,
        public readonly status: "placed" | "fulfilled" | "partial",
        public readonly fullfilledQuantity = 0) {

        super(id, stockId, 'sell', price, quantity, 'placed');
    }


}