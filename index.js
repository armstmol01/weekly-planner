const express = require('express');
const path = require('path');

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

// Put all API endpoints under '/api'
const SERVER_ERROR_CODE = 500;
const CLIENT_ERROR_CODE = 400;

// Express only serves static assets in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }

// let db = await pool.connect();
// await db.query(qry, [access_token, refresh_token, expires_at, 90470]);
// db.release();

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });

app.get('/test', async (req, res) => {
  try {
    res.send("hey");
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

const port = process.env.PORT || 5000;
app.listen(port);