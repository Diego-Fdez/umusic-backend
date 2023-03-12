CREATE DATABASE IF NOT EXISTS umusic;

USE umusic;

CREATE TABLE users (
  id VARCHAR(30) NOT NULL,
  email VARCHAR(32) NOT NULL,
  user_name VARCHAR(50) NOT NULL,
  picture VARCHAR(200),
  room_id VARCHAR(50) NOT NULL,
  user_type CHAR(1),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (id),
  UNIQUE KEY (email),
  PRIMARY KEY (id)
);

CREATE TABLE temporary_users (
  id VARCHAR(30) NOT NULL,
  user_id VARCHAR(30) NOT NULL,
  user_name VARCHAR(30),
  user_type VARCHAR(1) NOT NULL DEFAULT 'T',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (id),
  PRIMARY KEY (id)
);

ALTER TABLE temporary_users add FOREIGN KEY (user_id) REFERENCES users (id);

CREATE TABLE channels (
  id VARCHAR(50) NOT NULL,
  channel_title(50) NOT NULL,
  channel_pic_url VARCHAR(150),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (id),
  PRIMARY KEY (id)
);

CREATE TABLE videos (
  id VARCHAR(50) NOT NULL,
  channel_id VARCHAR(50) NOT NULL,
  video_title VARCHAR(70) NOT NULL,
  video_pic_url VARCHAR(150),
  video_length VARCHAR(8),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (id),
  PRIMARY KEY (id)
);

ALTER TABLE videos add FOREIGN KEY (channel_id) REFERENCES channels (id);

CREATE TABLE rooms (
  id INT NOT NULL AUTO_INCREMENT,
  room_id VARCHAR(100) NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  room_name VARCHAR(30) DEFAULT NULL,
  video_id VARCHAR(50) DEFAULT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

ALTER TABLE rooms add FOREIGN KEY (video_id) REFERENCES videos (id);
ALTER TABLE rooms add FOREIGN KEY (user_id) REFERENCES users (id);
