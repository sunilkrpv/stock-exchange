export interface Order {
    id: number;
    type: 'buy' | 'sell';
    stockId: string;
    price: number;
    quantity: number;
    fullfilledQuantity: number;
    status: 'placed' | 'fulfilled' | 'partial';
}