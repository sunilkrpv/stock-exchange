import { EventEmitter } from "stream";
import { RoutingService } from "./routing-service";
import { MatchingEngine } from "./matching-engine";
import { createReadStream } from "fs";
import csv = require('csv-parser');

export class StockExchangeApp {

    private routingService: RoutingService = null;
    private matchingEngine: MatchingEngine = null;

    private static instance: StockExchangeApp;

    private constructor() {
        this.routingService = new RoutingService();
        this.matchingEngine = new MatchingEngine();
    }

    static getInstance() {
        return StockExchangeApp.instance;
    }

    static async init() {
        if (!StockExchangeApp.instance) {
            StockExchangeApp.instance = new StockExchangeApp();
            await StockExchangeApp.instance.matchingEngine.initialize();
            await StockExchangeApp.instance.routingService.initialize();
        }
        return StockExchangeApp.instance;
    }

    loadOrders() {


        createReadStream('./orders.csv')
            .pipe(csv())
            .on("data", async (data: { id: string; type: any; stockId: any; price: string; quantity: string; }) => {

                await this.routingService.add({
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
                //this.matchingEngine.fulfillOrders();
            });
    }
}