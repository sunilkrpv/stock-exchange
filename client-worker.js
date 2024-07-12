import { Worker } from 'worker_threads';

const worker = new Worker('./client.js', { workerData: { port: 2222, hostname: 'localhost' } });

worker.on('message', (message) => {
    console.log('message from thread :', message);
})
worker.on("error", (msg) => {
    console.log(msg);
});
console.log('worker started')