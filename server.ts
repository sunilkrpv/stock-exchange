import { createSocket } from 'dgram';

const server = createSocket('udp4')

const port = 2222

server.on('listening', () => {
  // Server address it’s using to listen

  const address = server.address()

  console.log('Listening to ', 'Address: ', address.address, 'Port: ', address.port)
})

server.on('message', (message, info) => {
  console.log('Message', message.toString())

  const response = Buffer.from(`Message Received at: ${new Date()}`)

  //sending back response to client

  server.send(response, info.port, info.address, (err) => {
    if (err) {
      console.error('Failed to send response !!')
    } else {
      console.log('Response send Successfully')
    }
  })
})

server.bind(port)
