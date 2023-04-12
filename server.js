import  app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const {DB_HOST} = process.env;

mongoose.connect(DB_HOST)
.then(()=>app.listen(8080, () => {
  console.log("Server running. Use our API on port: 3000")
}))
.catch(error=>console.log(error.message));

