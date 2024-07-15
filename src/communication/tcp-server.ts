import { Server, Socket, createServer } from 'net';


export class TcpServer {

    readonly port: number;
    readonly hostname: string;
    private server: Server;
    private clients: Socket[] = [];

    constructor(port: number | undefined, hostname: string | undefined) {
        this.port = port;
        this.hostname = hostname;
    }

    start() {

        if (this.server) throw new Error('Server has already been started');


        this.server = createServer(this.clientConnectionHandler);
        this.server.listen(this.port, this.hostname, () => {
            console.log(`TCP server started Address:${this.hostname} PORT:${this.port}`);
        });
    }

    stop() {
        this.server.close();
    }

    send(msg: string) {

        const message = Buffer.from(msg);
        this.clients.forEach((client) => {
            client.write(msg);
        });
    }

    private clientConnectionHandler(clientSocket: Socket) {

        console.log(`new client connected:${clientSocket.address} at ${new Date().toDateString()}`);
        this.clients.push(clientSocket);
        clientSocket.on('data', (data) => {
            this.handleClientMessage(data);
        });
    }

    private handleClientMessage(buff: Buffer) {

        const message = Buffer.from
    }
}