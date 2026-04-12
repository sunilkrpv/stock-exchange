import { TcpServer } from "./communication/tcp-server";
import { UdpServer } from "./communication/udp-server";
import { StockExchangeApp } from "./core/stock-exchange-app";

const udp_server = new UdpServer(2223, 'localhost');
const tcp_server = new TcpServer(2222, 'localhost');

async function udpBootup() {

    udp_server.start();
    tcp_server.start();

    // await StockExchangeApp.init();
    // StockExchangeApp.getInstance().loadOrders();
}

udpBootup();