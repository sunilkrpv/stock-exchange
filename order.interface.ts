export interface Order {
    id: string;
    type: 'buy' | 'sell';
    stockId: string;
    price: number;
    quantity: number;
}