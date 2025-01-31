import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './src/routes/routes';
import fileUpload from './src/routes/file.upload.route';
import userController from './src/controllers/user.controller';


const app = express();
const port = 3000;

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
})

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}))

app.use('/api', fileUpload)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', router);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('search', async (query) => {
        const results = await userController.searchUser(query);
        socket.emit('searchResults', results);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    })
})

server.listen(port, () => {
    console.log(`Backend Server running on port ${port}`);
})