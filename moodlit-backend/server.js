import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOST;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


const username = encodeURIComponent(process.env.MONGO_USERNAME);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const database = encodeURIComponent(process.env.MONGO_DATABASE);

const uri = `mongodb+srv://${username}:${password}@cluster0.dhchqcf.mongodb.net/${database}?retryWrites=true&w=majority&appName=Cluster0`;


mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error: ", err));



app.listen(port, () => {
    console.log(`Server in execution on ${host}:${port}`);
  });
