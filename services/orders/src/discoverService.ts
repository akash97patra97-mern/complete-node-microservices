import amqp from 'amqplib';
import axios from 'axios';

let channel: amqp.Channel;

const discoverService = async (serviceName: string) => {
    const res = await axios.get(`http://consul:8500/v1/health/service/${serviceName}`);

    if (!res.data.length) {
        throw new Error(`No healthy instances found for ${serviceName}`);
    }

    const { Service, Port } = res.data[0].Service;

    const url = `http://${Service}:${Port}`;
    console.log(`Discovered ${serviceName} at ${url}`);
    return url;
}

const connectRabbitMQ = async () => {
 const connection = await amqp.connect("amqp://rabbitmq:5672");
 channel= await connection.createChannel();
 channel.assertQueue("payment-queue",{durable:true});
 console.log("Connected to RabbitMQ")
}

const publishQueue = async (queueName:string,message: object) => {
    if (!channel) throw new Error("RabbitMQ channel not initialized");

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent:true
    })
    console.log(`Message send to queue ${queueName}`,message)
}

export {discoverService,connectRabbitMQ,publishQueue}