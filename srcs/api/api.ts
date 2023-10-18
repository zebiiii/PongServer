import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, API!');
});

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});