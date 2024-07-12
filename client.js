import { createSocket } from 'dgram'
import { parentPort, workerData } from 'worker_threads';


const client = createSocket('udp4')

const port = workerData.port

const hostname = workerData.hostname;

client.on('message', (message, info) => {
  // get the information about server address, port, and size of packet received.

  console.log('Address: ', info.address, 'Port: ', info.port, 'Size: ', info.size)

  //read message from server

  console.log('Message from server', message.toString())
})

const packet = Buffer.from('This is a message from client')



setInterval(() => {

  client.send(packet, port, hostname, (err) => {
    if (err) {
      console.error('Failed to send packet !!')
    } else {
      //console.log('Packet send !!')
      parentPort.postMessage('Packet send !!');
    }
  })

}, 1000);
