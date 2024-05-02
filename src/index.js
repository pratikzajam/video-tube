import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

import mongoose from "mongoose";

connectDB();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
// app.on("error",(e)=>{
//     console.log("ERR:",error);
//     throw error
// })

// app.listen(process.env.PORT,()=>{
//     console.log(`App is listening on port ${process.env.PORT}`);
// })

//   } catch (error) {
//     console.log("ERROR", error);
//     throw err;
//   }
// })();
