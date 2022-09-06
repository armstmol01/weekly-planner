'use strict';
const express = require('express');
const path = require('path');
const crypto = require('crypto');

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
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// let db = await pool.connect();
// await db.query(qry, [access_token, refresh_token, expires_at, 90470]);
// db.release();

app.get('/test', async (req, res) => {
  try {
    console.log("Hello World");
    res.send("<p>Hey Queen</p>");
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// do we need the next parameter?
// login to user account
app.get('/api/login', async (req, res, next) => {
  try {
    const username = req.query.username;
    const password = req.query.password; // stored as text in Heroku db
    if (!username || !password) {
      return res.status(CLIENT_ERROR_CODE).send("The credentials you've entered are incorrect");
    }
    console.log(username);
    console.log(password);
    let qry = 'SELECT * FROM clients WHERE username = $1';
    let db = await pool.connect();
    let userData = await db.query(qry, [username]); // get for 1 row, all for multiple
    db.release();

    if (!userData) {
      // db.release();
      return res.status(CLIENT_ERROR_CODE).send("The username you've entered is incorrect");
    }

    // validate password w/ salt and hash function
    // success if hash of given password w/ stored salt equals stored password
    let salt = userData.salt;
    if (sha512(password, salt) !==  userData.password) {
      // db.release();
      return res.status(CLIENT_ERROR_CODE).send("The password you've entered is incorrect");
    }

    // successful login
    let result = {
      "id" : userData.id,
      "username" : username
    };
    console.log(result);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERROR_CODE).send("Failed to process request");
  }
});

// get tasks for specified user
app.get('/api/tasks', async (req, res, next) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      return res.status(CLIENT_ERROR_CODE).send("Missing request params");
    }
    // get tasks associated w/ user
    qry = 'SELECT * FROM tasks WHERE user_id = $1';
    let db = await pool.connect();
    let taskData = await db.query(qry, [userId]);
    db.release();

    if (!taskData) {
      return res.status(SERVER_ERROR_CODE).send("Invalid resources");
    }

    // return array of tasks for current week (days 1-7)
    let result = {
      "tasks": taskData.rows
    }

    console.log(result);

    res.json(result);
    console.log(result);
  } catch (err) {
    console.log(err);
    res.status(SERVER_ERROR_CODE).send("Failed to process request");
  }
});

// create new user account
app.post('/api/new-user', async function (req, res, next) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
      return res.status(CLIENT_ERROR_CODE).send("Missing body params");
    }
    let qry = 'SELECT username FROM clients WHERE username = $1';
    let db = await pool.connect();
    let userExists = await db.query(qry, [username]);

    if (userExists) {
      // username already exists
      db.release();
      return res.status(CLIENT_ERROR_CODE).send("Username already exists");
    }

    // username is unique
    // generate salt
    const salt = genSalt(3); // 3 bytes?
    // generate hashed password
    const hPassword = sha512(password, salt);

    // add user to database
    qry = 'INSERT INTO clients(username, password, salt) VALUES($1, $2, $3)';
    await db.query(qry, [username, hPassword, salt]);
    db.release();
    res.send('<p>Made a new user</p>');
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERROR_CODE).send("Failed to process request");
  }
});

// add a new task
app.post('/api/add-task', async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const day = req.body.day;
    const taskContent = req.body.task;

    if (!userId || !day || !taskContent) {
      return res.status(CLIENT_ERROR_CODE).send("Missing body params");
    }

    // add task to database
    let qry = 'INSERT INTO tasks(user_id, day, content) VALUES($1, $2, $3)';
    let db = await pool.connect();
    await db.query(qry, [userId, day, taskContent]);
    db.release();
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERROR_CODE).send("Failed to process request");
  }
});

// delete existing task
app.post('/api/delete-task', async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const day = req.body.day;
    const taskContent = req.body.task;

    if (!userId || !day || !taskContent) {
      return res.status(CLIENT_ERROR_CODE).send("Missing body params");
    }

    // delete task from database
    let qry = 'DELETE FROM tasks WHERE user_id = $1 AND day = $2 AND content = $3';
    let db = await pool.connect();
    await db.query(qry, [userId, day, taskContent]);
    db.release();
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERROR_CODE).send("Failed to process request");
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

/**
* generates random string of characters i.e salt
* @function
* @param {number} length - Length of the random string.
*/
function genSalt(length) {
  return crypto.randomBytes(Math.ceil(length/2))
  .toString('hex') /** convert to hexadecimal format */
  .slice(0,length); /** return required number of characters */
};

/**
* hash password with sha512.
* @function
* @param {string} password - List of required fields.
* @param {string} salt - Data to be validated.
*/
function sha512(password, salt) {
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:value
  };
};

const port = process.env.PORT || 5000;
app.listen(port);