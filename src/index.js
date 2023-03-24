import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import roomsRoutes from './routes/roomsRoutes.js';
import generateQR from './routes/codeQRRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';

const app = express();
const Port = 4000;

app.use(morgan('dev'));
app.use(express.json());

//cors configuration
const whitelist = [process.env.FRONTEND_URL];

/* A function that checks if the origin is in the whitelist. */
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

/* A middleware that enables cors. */
app.use(cors(corsOptions));

app.use('/api/v1', userRoutes);
app.use('/api/v1', roomsRoutes);
app.use('/api/v1', generateQR);
app.use('/api/v1', categoriesRoutes);

app.listen(Port, () => {
  console.log(`Example app listening at http://localhost:${Port}`);
});
