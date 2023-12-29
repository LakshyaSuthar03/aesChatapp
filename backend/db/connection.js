import mongoose from "mongoose";
mongoose
  .connect(
    "add mongodb connection url    %40 for L"
  )
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });
