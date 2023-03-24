import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../database/pool.js';
import generateId from '../helpers/generateId.js';

dotenv.config();

//register a new admin
const registerUser = async (id, email, userName, picture) => {
  const userType = 'P';
  const roomId = `${generateId()}${id}`;
  try {
    /* Inserting a new user into the database. */
    await pool.query(
      'INSERT INTO users (id, email, user_name, picture, room_id, user_type) VALUES (?,?,?,?,?,?)',
      [id, email, userName, picture, roomId, userType]
    );

    //check the user
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = '${email}'`
    );

    return rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/** It checks if the user exists in the database, if not, it registers the user and returns the user's
 * data, if the user exists, it returns the user's data */
export const loginUser = async (req, res) => {
  const { id, email, userName, picture } = req.body;
  let data = {};

  try {
    //check the user
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = '${email}'`
    );

    /* Checking if the user exists in the database, if not, it registers the user and returns the
    user's
     * data, if the user exists, it returns the user's data. */
    if (rows.length <= 0) {
      const result = await registerUser(id, email, userName, picture);
      data = result;
    } else {
      data = rows[0];
    }

    //generate a token for the user
    const token = jwt.sign(
      { id: data.id, userType: data.user_type },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );

    const { createdAt, ...rest } = data;

    res.send({
      status: 'OK',
      data: { music_token: token, userInfo: rest },
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};

/**It takes a temporary user id, checks if the user exists, and if it does, it generates a token for
 * the user */
const temporaryUserLogin = async (temporaryUserId) => {
  try {
    //check the user
    const [rows] = await pool.query(
      `SELECT id, user_id, user_type, room_id FROM temporary_users WHERE id = '${temporaryUserId}'`
    );

    //generate a token for the temporary user
    const token = jwt.sign(
      { id: rows[0].id, userType: rows[0].user_type },
      process.env.JWT_SECRET,
      {
        expiresIn: '5h',
      }
    );

    return { music_token: token, userInfo: rows[0] };
  } catch (error) {
    throw error;
  }
};

//register a new temporary use
export const temporaryUserRegistration = async (req, res) => {
  const { id } = req.query;

  /* Generating a random id for the temporary user. */
  const temporaryUserId = generateId();

  try {
    /* searching for the user in the database. */
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);

    if (rows.length <= 0)
      return res.status(404).send({ status: 'FAILED', data: 'User not found' });

    //register the temporary user
    await pool.query(
      'INSERT INTO temporary_users (id, user_id, room_id) VALUES (?,?,?)',
      [temporaryUserId, rows[0].id, rows[0].room_id]
    );

    const result = await temporaryUserLogin(temporaryUserId);

    res.send({
      status: 'OK',
      data: result,
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};
