import { pool } from '../database/pool.js';

/** It checks if the channel exists in the database, if it does not exist, it inserts the channel into
 * the database */
export const registerChannel = async (channelId, title, channelPictureURL) => {
  try {
    //check the channel in the DB
    const [rows] = await pool.query(
      `SELECT * FROM channels WHERE id = '${channelId}'`
    );

    /* Checking if the channel exists in the database. If it does not exist, it will insert the channel
    into the database. */
    if (rows.length <= 0)
      await pool.query(
        'INSERT INTO channels (id, channel_title, channel_pic_url) VALUES (?,?,?)',
        [channelId, title, channelPictureURL]
      );
  } catch (error) {
    if (error.code !== 'ER_DUP_ENTRY')
      res
        .status(error?.status || 500)
        .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};

/** It checks if the video exists in the database, if it does not exist, it inserts the video into
 * the database */
export const registerVideo = async (
  videoId,
  channelId,
  videoTitle,
  videoPictureURL,
  videoLength
) => {
  try {
    //check the video in the DB
    const [rows] = await pool.query(
      `SELECT * FROM videos WHERE id = '${videoId}'`
    );

    /* Checking if the video exists in the database. If it does not exist, it will insert the video
    into the database. */
    if (rows.length <= 0)
      await pool.query(
        'INSERT INTO videos (id, channel_id, video_title, video_pic_url, video_length) VALUES (?,?,?,?,?)',
        [videoId, channelId, videoTitle, videoPictureURL, videoLength]
      );
  } catch (error) {
    if (error.code !== 'ER_DUP_ENTRY') throw error;
  }
};
