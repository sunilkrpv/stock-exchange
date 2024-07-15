import { Order } from "./order.interface";

export abstract class AbstractOrder implements Order {
    //id: number;
    // type: "buy" | "sell";
    // stockId: string;
    // price: number;
    // quantity: number;
    // fullfilledQuantity: number;
    // status: "placed" | "fulfilled" | "partial";


    constructor(public readonly id: number,
        public readonly stockId: string,
        public readonly type: 'buy' | 'sell',
        public readonly price: number,
        public readonly quantity: number,
        public readonly status: "placed" | "fulfilled" | "partial",
        public readonly fullfilledQuantity = 0) {
    }


}