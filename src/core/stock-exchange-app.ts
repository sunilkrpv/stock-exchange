import { EventEmitter } from "stream";
import { RoutingService } from "./routing-service";
import { MatchingEngine } from "./matching-engine";
import { OrderQueue, OrderQueueFactory } from "../order-queue";
import { createReadStream } from "fs";
import csv = require('csv-parser');

export class StockExchangeApp {

    private eventEmitter: EventEmitter = null;
    private routingService: RoutingService = null;
    private matchingEngine: MatchingEngine = null;
    private sellQueue: OrderQueue = null;
    private buyQueue: OrderQueue = null;

    private static instance: StockExchangeApp;

    private constructor() {
        this.eventEmitter = new EventEmitter();
        this.routingService = new RoutingService(this.eventEmitter);
        this.matchingEngine = new MatchingEngine(this.eventEmitter);
        this.sellQueue = OrderQueueFactory.create('sell', this.eventEmitter);
        this.buyQueue = OrderQueueFactory.create('buy', this.eventEmitter);
    }

    static getInstance() {
        if (!StockExchangeApp.instance) {
            StockExchangeApp.instance = new StockExchangeApp();
        }
        return StockExchangeApp.instance;
    }

    loadOrders() {


        createReadStream('./orders.csv')
            .pipe(csv())
            .on("data", (data: { id: string; type: any; stockId: any; price: string; quantity: string; }) => {

                this.routingService.add({
                    id: parseInt(data.id, 10),
                    type: data.type,
                    stockId: data.stockId,
                    price: parseFloat(data.price),
                    quantity: parseInt(data.quantity, 10),
                    fullfilledQuantity: 0,
                    status: 'placed'
                });
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                this.matchingEngine.fulfillOrders();
            });
    }
}