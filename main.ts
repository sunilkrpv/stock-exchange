import { UdpServer } from "./udp-server";

const server = new UdpServer(2222, 'localhost');

async function udpBootup() {

    server.start();
}

udpBootup();