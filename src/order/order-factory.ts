import { AbstractOrder } from "./abstract-order";
import { BuyOrder } from "./buy-order";
import { Order } from "./order.interface";
import { SellOrder } from "./sell-order";

/**
 * class: OrderFactory - this class creates instances of the {@link BuyOrder} or {@link SellOrder}
 */
export class OrderFactory {

    constructor() {

    }

    /**
     * Creates a new instance of an order - {@link BuyOrder} or {@link SellOrder}
     * @param order an order type data
     * @returns 
     */
    static create(order: Order) {

        let newOrder: AbstractOrder = null;

        if (order.type === 'buy') {

            newOrder = new BuyOrder(order.id, order.stockId, order.price, order.quantity, order.status, order.fullfilledQuantity);
        }
        else {

            newOrder = new SellOrder(order.id, order.stockId, order.price, order.quantity, order.status, order.fullfilledQuantity);
        }

        return newOrder;
    }
}