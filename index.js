// 'use strict';
const express = require('express');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

// Parse JSON bodies for this app
app.use(express.json());

const { Pool } = require('pg');

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL || 'postgresql://postgres:8789@localhost:5432/werkweek',
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

const pool = (() => {
  if (process.env.NODE_ENV !== 'production') {
      return new Pool({
          connectionString: 'postgresql://postgres:molly2001@localhost:5432/werkweek',
          ssl: false
      });
  } else {
      return new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false
          }
      });
  } })();

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
    if (!req.query.username || !req.query.password) {
      return res.status(CLIENT_ERROR_CODE).send("The credentials you've entered are incorrect");
    }
    const username = req.query.username;
    const password = req.query.password; // stored as text in Heroku db

    let qry = 'SELECT * FROM users WHERE username = $1';
    let db = await pool.connect();
    let userData = await db.query(qry, [username]); // get for 1 row, all for multiple
    db.release();

    if (userData.rowCount === 0) {
      // user does not exist
      return res.status(CLIENT_ERROR_CODE).send("The username you've entered is incorrect");
    }

    // validate password w/ salt and hash function
    // success if hash of given password w/ stored salt equals stored password
    let salt = userData.rows[0].salt;
    // console.log(salt);
    // console.log(sha1(password, salt).passwordHash);
    // console.log(userData.rows[0].password);
    if (sha1(password, salt).passwordHash !==  userData.rows[0].password) {
      // incorrect password
      return res.status(CLIENT_ERROR_CODE).send("The password you've entered is incorrect");
    }

    // successful login
    let result = {
      "id" : userData.rows[0].id,
      "username" : username
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERROR_CODE).send("Failed to process request");
  }
});

// create new user account
app.post('/api/new-user', async function (req, res, next) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    // console.log("new " + username);
    // console.log("new " + password);
    if (!username || !password) {
      console.log("missing params");
      return res.status(CLIENT_ERROR_CODE).send("Missing body params");
    }
    let qry = 'SELECT username FROM users WHERE username = $1';
    let db = await pool.connect();
    let userExists = await db.query(qry, [username]);

    if (userExists.rowCount !== 0) {
      // username already exists
      console.log("user exists");
      db.release();
      return res.status(CLIENT_ERROR_CODE).send("User already exists");
    }

    // username is unique
    // generate salt
    const salt = genSalt(3); // 3 bytes?
    // generate hashed password
    const hPassword = sha1(password, salt).passwordHash;
    // console.log("new user salt " + salt);
    // console.log("new user hash " + hPassword);

    // add user to database
    qry = 'INSERT INTO users(username, password, salt) VALUES($1, $2, $3)';
    await db.query(qry, [username, hPassword, salt]);
    db.release();
    res.send('<p>Made a new user</p>');
  } catch (err) {
    console.log(err);
    res.status(SERVER_ERROR_CODE).send("Failed to process request");
  }
});

// delete existing user
app.post('/api/delete-user', async (req, res, next) => {
  try {
    if (!req.body.id || !req.body.username) {
      console.log("missing body params");
      return res.status(CLIENT_ERROR_CODE).send("Missing body params");
    }

    const userId = req.body.id;
    const username = req.body.username;

    // delete task from database
    let qry = 'DELETE FROM users WHERE id = $1 AND username = $2';
    let db = await pool.connect();
    await db.query(qry, [userId, username]);
    db.release();
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
      console.log("missing body params")
      return res.status(CLIENT_ERROR_CODE).send("Missing request params");
    }
    // get tasks associated w/ user
    qry = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY day, id';
    let db = await pool.connect();
    let taskData = await db.query(qry, [userId]);
    db.release();

    if (!taskData) {
      console.log("no tasks for user");
      return res.status(CLIENT_ERROR_CODE).send("No tasks for user");
    }

    // return array of tasks for current week (days 1-7)
    let result = {
      "tasks": taskData.rows
    }

    res.json(result);
  } catch (err) {
    console.log(err);
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
    let qry = 'INSERT INTO tasks(user_id, day, content, checked) VALUES($1, $2, $3, $4)'; // explicitly say checked = false??
    let db = await pool.connect();
    await db.query(qry, [userId, day, taskContent, false]);
    db.release();
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERROR_CODE).send("Failed to process request");
  }
});

// add a new task
app.post('/api/check-task', async (req, res, next) => {
  try {
    // bug when checkedStatus = 'false' since !checkedStatus evaluates to true, or "missing"
    if (!req.body.userId || !req.body.day || !req.body.task || req.body.checkedStatus === null) {
      console.log("missing body");
      return res.status(CLIENT_ERROR_CODE).send("Missing body params");
    }

    const userId = req.body.userId;
    const day = req.body.day;
    const taskContent = req.body.task;
    const checked = req.body.checkedStatus;

    // add task to database
    let qry = 'UPDATE tasks SET checked = $1 WHERE user_id = $2 AND day = $3 AND content = $4';
    let db = await pool.connect();
    await db.query(qry, [checked, userId, day, taskContent]);
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
      console.log("missing body params");
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

// get tasks for specified user
app.get('/api/notes', async (req, res, next) => {
  try {
    if (!req.query.id) {
      console.log("missing body params")
      return res.status(CLIENT_ERROR_CODE).send("Missing request params");
    }

    const userId = req.query.id;
    // get tasks associated w/ user
    qry = 'SELECT content FROM notes WHERE user_id = $1';
    let db = await pool.connect();
    let notesData = await db.query(qry, [userId]);
    db.release();

    let result = {'notes': ''}

    if (notesData.rowCount === 0) {
      res.json(result);
      return;
    }

    // return array of tasks for current week (days 1-7)
    result = {
      'notes': notesData.rows[0].content
    }

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(SERVER_ERROR_CODE).send("Failed to process request");
  }
});

// save notes to database
app.post('/api/save-notes', async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const notesContent = req.body.notes || "";

    if (!userId) {
      return res.status(CLIENT_ERROR_CODE).send("Missing body params");
    }

    if (!notesContent.length) { // save space by not storing empty notes
      let qry = 'DELETE FROM notes WHERE user_id=$1';
      let db = await pool.connect();
      await db.query(qry, [userId]);
      db.release();
    } else {
      // add or update notes for given user
      let qry = 'INSERT INTO notes(user_id, content) VALUES($1, $2) ON CONFLICT (user_id) DO UPDATE SET content = $2';
      let db = await pool.connect();
      await db.query(qry, [userId, notesContent]);
      db.release();
    }
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERROR_CODE).send("Failed to process request");
  }
});

app.post('/api/delete-week', async (req, res, next) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(CLIENT_ERROR_CODE).send("Missing body params");
    }

    // add or update notes for given user
    let notesContent = '';
    let notesQry = 'DELETE FROM notes WHERE user_id = $1';
    let tasksQry = 'DELETE FROM tasks WHERE user_id = $1';
    let db = await pool.connect();
    await db.query(notesQry, [userId]);
    await db.query(tasksQry, [userId]);
    db.release();
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERROR_CODE).send("Failed to process request");
  }
})

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
* hash password with sha1.
* @function
* @param {string} password - List of required fields.
* @param {string} salt - Data to be validated.
*/
function sha1(password, salt) {
  var hash = crypto.createHmac('sha1', salt); /** Hashing algorithm sha1 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:value
  };
};

const port = process.env.PORT || 5000;
app.listen(port);