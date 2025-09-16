import express from 'express';
import pool from './dbConfig.js';
import { initDB } from './addressModel.js';
import router from './router.js';
import { errorhandler } from './errorHandler.js';
import axios from 'axios';
import { startConsumer } from './discoverService.js';

const app=express();

const CONSUL_HOST = "http://consul:8500";
const SERVICE_NAME = process.env.SERVICE_NAME || "address-service";
const SERVICE_PORT = Number(process.env.SERVICE_PORT) || 5001;

app.get('/health', (req, res) => {
    res.status(200).send('Service is healthy');
});

const registerService = async ()=>{
    try {
        await axios.put(`${CONSUL_HOST}/v1/agent/service/register`,{
            Name: SERVICE_NAME,
            Port: SERVICE_PORT,
            Check:{
                HTTP: `http://address-service:${SERVICE_PORT}/health`,
                Interval: "10s"
            }
        })
        console.log(`${SERVICE_NAME} registered with Consul on port ${SERVICE_PORT}`);
    } catch (err) {
         console.error("Failed to register service with Consul", err);
    }
}
//for body parser
app.use(express.json());
pool.connect().then(async ()=>{
    console.log("Address DB connected.")
    await initDB();
});

app.use('/api',router)

app.use(errorhandler)

startConsumer().catch(err => {
  console.error("Failed to start RabbitMQ consumer:", err);
});

app.listen(5001,async ()=>{
    console.log("Address is connected on 5001.")
    await registerService();
})
