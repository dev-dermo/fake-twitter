import express from 'express';
import logger from 'morgan';
import db from './config/connection.js';

// pool.connect();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/dist'));
}

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT users.id, users.username, tweets.id, tweets.body, tweets.user_id FROM users JOIN tweets ON users.id = tweets.user_id WHERE users.id = $1', [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong!' });
      return;
    }

    if (result.rows.length) {
      const preformattedData = {
        id: result.rows[0].user_id,
        username: result.rows[0].username,
        tweets: result.rows.map(tweet => {
          return  {
            id: tweet.id,
            body: tweet.body,
            user_id: tweet.user_id,
          };
        }),
      };

      res.status(200).json([preformattedData]);
      return;
    }

    res.status(200).json(result.rows);
  });
});

app.get('/api/users', (req, res) => {
  db.query('SELECT id, username FROM users', [], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong!' });
      return;
    }

    res.status(200).json(result.rows);
  });
});

app.post('/api/users', (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password], (err, result) => {
    if (err) {
      res.status(500).redirect('/');
      return;
    }

    res.status(201).redirect('/')
  })
});

app.get('/api/tweets', (req, res) => {
  db.query('SELECT users.id, users.username, tweets.id, tweets.body, tweets.user_id FROM users JOIN tweets ON users.id = tweets.user_id ORDER BY tweets.id DESC', [], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong!' });
      return;
    }
    console.log(result.rows);
    // preformattedData

    res.status(200).json(result.rows);
  });
});

app.post('/api/tweets', (req, res) => {
  const { user_id, body } = req.body;

  db.query('INSERT INTO tweets (user_id, body) VALUES ($1, $2)', [user_id, body], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong!' });
      return;
    }

    res.redirect('/tweets');
  });
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