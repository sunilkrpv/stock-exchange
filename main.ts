import { UdpServer } from "./src/communication/udp-server";
import { StockExchangeApp } from "./src/core/stock-exchange-app";

const server = new UdpServer(2222, 'localhost');

async function udpBootup() {

    server.start();
    StockExchangeApp.getInstance().loadOrders();
}

udpBootup();