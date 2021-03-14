
const express = require('express')//подключаем пакеты
const config = require('config')
const mongoose = require('mongoose')
const app = express()
const server = require('http').createServer(app);

import createRoutes from './core/routes'
import {createSocket} from './core/socket'

const options = {
    cors: {
        origin: "http://localhost:1000",
        methods: ["GET", "POST"]
    }
}
const io = createSocket(server, options);
createRoutes(app)

const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`)) // запускаем сервер на порте который записан в PORT


    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()