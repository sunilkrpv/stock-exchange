import { Order } from "../order/order.interface";
import { Kafka, Producer } from 'kafkajs';

/**
 * class: RoutingService - Routes the incoming orders to the BUY or SELL topics of the broker.
 */
export class RoutingService {

    private kafkaProducer: Producer;

    constructor() { }

    async initialize() {

        const kafka = new Kafka({ 
            clientId: process.env.KAFKA_CLUSTER_ID,
            brokers: [process.env.KAFKA_SEED_BROKER]
        });
        this.kafkaProducer = kafka.producer({ allowAutoTopicCreation: true });
        await this.kafkaProducer.connect();
    }

    async add(order: Order) {

        console.log(`received new order: ${order.id} ${order.stockId}`);

        await this.kafkaProducer.send({
            topic: order.type,
            messages: [{
                key: order.stockId,
                value: JSON.stringify(order)
            }]
        })
        //.then(() => console.log(`sent message to broker`))
        .catch(e => console.error(`[example/producer] ${e.message}`, e));
    }

}