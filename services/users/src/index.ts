import express, { Application } from 'express';
import pool from './dbConfig.js';
import router from './router.js';
import { errorhandler } from './errorHandler.js';
import axios from 'axios';
import { connectRabbitMQ } from './discoverService.js';
import { ApolloServer } from 'apollo-server-express';
// import { typeDefs } from './graphql/schema.js';
// import { resolvers } from './graphql/resolver.js';
import { initDB } from './userModel.js';

const app: Application = express();
const CONSUL_HOST = "http://consul:8500";
const SERVICE_NAME = process.env.SERVICE_NAME || "user-service";
const SERVICE_PORT = Number(process.env.SERVICE_PORT) || 5000;

app.use(express.json());

pool.connect().then(async () => {
    console.log("User DB connected.")
    await initDB();
});

const registerService = async () => {
    try {
        await axios.put(`${CONSUL_HOST}/v1/agent/service/register`, {
            Name: SERVICE_NAME,
            Port: SERVICE_PORT,
            Check: {
                HTTP: `http://user-service:${SERVICE_PORT}/health`,
                Interval: "10s"
            }
        });
        console.log(`${SERVICE_NAME} registered with Consul on port ${SERVICE_PORT}`);
    } catch (err) {
        console.error("Failed to register service with Consul", err);
    }
};

// async function startApolloServer(){
//     const server = new ApolloServer({typeDefs: typeDefs,resolvers: resolvers});
//     await server.start();
//     server.applyMiddleware({ app, path: "/graphql" });
// }

app.get('/health', (req, res) => {
    res.status(200).send('Service is healthy');
});

app.use('/api', router);
app.use(errorhandler);
// startApolloServer();

app.listen(5000, async () => {
    console.log("User is connected on 5000.");
    await registerService();
    await connectRabbitMQ();
});

