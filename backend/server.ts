import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './src/routes/routes';
import fileUpload from './src/routes/file.upload.route';


const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}))

app.use('/api', fileUpload)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', router);

app.listen(port, () => {
    console.log(`Backend Server running on port ${port}`);
})