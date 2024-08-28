import express from 'express';
import logger from 'morgan';
import db from './config/connection.js';

// pool.connect();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/dist'));
}

app.post('/api/users', (req, res) => {
  console.log(req.body);

  res.end();
});

app.get('/api/health', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) {
      res.status(500).json({ err });
      return;
    }
    
    res.json(result.rows);
  });
});

(async () => {
  try {
    await db.connect();
    console.log('Connected to db...');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));  
  } catch (error) {
    console.error(error);
  }
})();