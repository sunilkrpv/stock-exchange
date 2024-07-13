import { UdpServer } from "./udp-server";
import { createReadStream } from 'fs';
import csv = require('csv-parser');
import { Order } from "./order.interface";
import { RoutingService } from "./routing-service";
import { MatchingEngine } from "./matching-engine";
import { EventEmitter } from 'events';
import { OrderProcessingService } from "./order-processing-service";

const server = new UdpServer(2222, 'localhost');

const eventEmitter = new EventEmitter();
const routingService = new RoutingService(eventEmitter);
const matchingEngine = new MatchingEngine(eventEmitter);
const processor = new OrderProcessingService(eventEmitter);

async function udpBootup() {

    server.start();
}

function loadOrders() {


    createReadStream('./orders.csv')
        .pipe(csv())
        .on("data", (data: { id: string; type: any; stockId: any; price: string; quantity: string; }) => {

            routingService.add({
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
            matchingEngine.fulfillOrders();
            //matchingEngine.print()
        });
}

udpBootup();
loadOrders();