import express from 'express';
import bodyParser from 'body-parser';
import router from './src/routes/routes';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}))

app.use('/api', router);

app.listen(port, () => {
    console.log(`Backend Server running on port ${port}`);
})