import express from 'express';
import bodyParser from 'body-parser';
import router from './src/routes/routes';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);

app.listen(port, () => {
    console.log(`Backend Server running on port ${port}`);
})