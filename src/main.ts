import { UdpServer } from "./communication/udp-server";
import { StockExchangeApp } from "./core/stock-exchange-app";

const server = new UdpServer(2222, 'localhost');

async function udpBootup() {

    server.start();
    await StockExchangeApp.init();
    StockExchangeApp.getInstance().loadOrders();
}

udpBootup();