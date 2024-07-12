import { RemoteInfo, Socket, createSocket } from 'dgram';



export class UdpServer {

    readonly port: number;
    readonly hostname: string;
    private socket: Socket;

    constructor(port: number | undefined, hostname: string | undefined) {
        this.port = port;
        this.hostname = hostname;
    }

    start() {

        if (this.socket) throw new Error('Server has already been started');


        this.socket = createSocket('udp4', this.messageHandler);


        this.socket.on('listening', () => {
            const address = this.socket.address()
            console.log('Listening to ', 'Address: ', address.address, 'Port: ', address.port)
        });

        this.socket.on('error', () => {
            console.log('THe server encountered an error')
        });
        this.socket.bind(this.port);
        console.log('server started....')
    }

    stop() {
        this.socket.disconnect();
    }

    send(msg: string) {

        const message = Buffer.from(msg);

        this.socket.send(message, this.port, this.hostname, (err) => {
            if (err) {
                console.error('Failed to send response !!')
                console.error(err);
            } else {
                console.log('Response send Successfully')
            }
        });
    }

    private messageHandler(msg: Buffer, rinfo: RemoteInfo) {

        console.log(`new message from ${rinfo.address} at ${new Date().toDateString()}`);

        this.socket.send(Buffer.from('ack'), this.port, this.hostname, (err) => {
            if (err) {
                console.error(`Failed to ACK ${rinfo.address}`)
            } else {
                console.log('Response send Successfully')
            }
        });
    }
}