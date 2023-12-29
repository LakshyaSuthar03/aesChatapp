import mongoose from "mongoose";
mongoose
  .connect(
    "mongodb+srv://lakshyasuthar:L%40kshya2003@cluster0.o01tzdk.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });
