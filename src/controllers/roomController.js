import { pool } from '../database/pool.js';
import { registerChannel, registerVideo } from './videoController.js';

/** It gets the data from the database and sends it to the frontend
 * @returns The data from the database. */
export const getRoomById = async (req, res) => {
  const { id } = req.params;

  try {
    /* A query to get the data from the database. */
    const [rows] =
      await pool.query(`SELECT r.id, r.room_id, r.video_id, r.user_id, v.video_title, v.video_length,
    v.video_pic_url, v.channel_id, c.channel_title, c.channel_pic_url, u.user_name
    FROM rooms r INNER JOIN videos v ON r.video_id = v.id INNER JOIN 
    channels c ON v.channel_id = c.id INNER JOIN users u ON r.user_id = u.id WHERE r.room_id = '${id}'`);

    /* Checking if the rows are empty and if they are it is returning a 404 error. */
    if (rows.length <= 0)
      return res.status(404).send({
        status: 'FAILED',
        data: 'Create a list and share music with your friends.',
      });

    /* Sending the data to the frontend. */
    res.send({ status: 'OK', data: rows });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};

/**inserts the channel info into the database, inserts the video
 * info into the database, and then inserts the room info into the database.*/
export const addVideosToRoomList = async (req, res) => {
  const {
    roomId,
    userId,
    videoId,
    channelId,
    videoTitle,
    channelTitle,
    videoPictureURL,
    channelPictureURL,
    videoLength,
  } = req.body;

  try {
    //insert the channel info in DB
    await registerChannel(channelId, channelTitle, channelPictureURL);

    //insert the video info in DB
    await registerVideo(
      videoId,
      channelId,
      videoTitle,
      videoPictureURL,
      videoLength
    );

    /* Inserting a new room into the database. */
    await pool.query(
      'INSERT INTO rooms (room_id, user_id, video_id) VALUES (?,?,?)',
      [roomId, userId, videoId]
    );

    res.send({ status: 'OK', data: 'Your video has been added to the list!' });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};

//It deletes a video from the room list
export const deleteVideoFromRoomList = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE * FROM rooms WHERE id = ?', [id]);

    if (result.affectedRows <= 0) {
      res.status(404).send({
        status: 'FAILED',
        data: { error: 'Video not found' },
      });
      return;
    }

    res.send({
      status: 'OK',
      data: 'Video removed from the list.',
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};
