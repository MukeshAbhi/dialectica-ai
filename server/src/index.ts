import express from 'express';

const app = express();
const PORT = process.env.PORT || 5003;

app.use(express.json());

app.get('/', (req, res) => {
    console.log('working');
    res.send('Running');
});

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});
