import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import roomsRoutes from './routes/roomsRoutes.js';
import generateQR from './routes/codeQRRoutes.js';

const app = express();
const Port = 4000;

app.use(morgan('dev'));
app.use(express.json());

//cors configuration
const whitelist = [process.env.FRONTEND_URL, process.env.DB_HOST];

/* A function that checks if the origin is in the whitelist. */
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

/* A middleware that enables cors. */
app.use(cors(corsOptions));

app.use('/api/v1', userRoutes);
app.use('/api/v1', roomsRoutes);
app.use('/api/v1', generateQR);

app.listen(Port, () => {
  console.log(`Example app listening at http://localhost:${Port}`);
});
