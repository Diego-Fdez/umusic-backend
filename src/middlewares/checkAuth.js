import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../database/pool.js';

dotenv.config();

//verify that the user is registered and user_type === P
export const checkAuthorizedUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      /* Verifying the token. */
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //check the user
      const [rows] = await pool.query(
        `SELECT * FROM users WHERE id = '${decoded.id}'`
      );

      const { createdAt, ...res } = rows[0];
      /* Assigning the result of the query to the req.user object. */
      req.user = res;

      if (decoded.userType === 'P') {
        return next();
      } else {
        res.status(401).send({
          status: 'FAILED',
          data: 'Permission denied, you must be an authorized user for the selected action',
        });
      }
    } catch (error) {
      return res
        .status(404)
        .send({ status: 'FAILED', data: { error: error?.message || error } });
    }
  }
  if (!token) {
    return res.status(401).send({ status: 'FAILED', data: 'Invalid token!' });
  }
  next();
};

//verify that the user is a temporary and authorized user_type === T or P
export const checkAuthTemporaryUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      /* Verifying the token. */
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //check the user
      const [rows] = await pool.query(
        `SELECT * FROM temporary_users WHERE id = '${decoded.id}'`
      );

      const { createdAt, ...rest } = rows[0];
      /* Assigning the result of the query to the req.user object. */
      req.user = rest;

      if (decoded.userType === 'T' || decoded.userType === 'P') {
        return next();
      } else {
        res.status(401).send({
          status: 'FAILED',
          data: 'Permission denied, you must be an authorized user for the selected action',
        });
      }
    } catch (error) {
      return res
        .status(404)
        .send({ status: 'FAILED', data: { error: error?.message || error } });
    }
  }
  if (!token) {
    return res.status(401).send({ status: 'FAILED', data: 'Invalid token!' });
  }
  next();
};

//check that the query parameters are valid
export const checkAuthQueryString = async (req, res, next) => {
  const { id, token } = req.query;

  try {
    /* Verifying the token. */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //check the user
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE id = '${decoded.id}'`
    );

    /* Checking if the id in the query string is the same as the id in the database. */
    if (id !== rows[0].id) {
      res.status(401).send({
        status: 'FAILED',
        data: 'Permission denied, the user is not registered in our database.',
      });
    }

    const { createdAt, ...rest } = rows[0];
    /* Assigning the result of the query to the req.user object. */
    req.user = rest;

    if (decoded.userType === 'P') {
      return next();
    } else {
      res.status(401).send({
        status: 'FAILED',
        data: 'Permission denied, you must be an authorized user for the selected action',
      });
    }
  } catch (error) {
    return res
      .status(404)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }

  if (!token) {
    return res.status(401).send({ status: 'FAILED', data: 'Invalid token!' });
  }
  next();
};
