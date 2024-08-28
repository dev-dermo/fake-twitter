import express from 'express';
import logger from 'morgan';

const app = express();

const PORT = process.env.PORT || 3001;

app.use(logger('dev'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/dist'));
}

app.get('/health', (req, res) => {
  res.send('Hello, World?');
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));