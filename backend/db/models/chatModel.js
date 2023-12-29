import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
  room: String,
  data: Object,
});
const chatModel = mongoose.model("chat", chatSchema);

export default chatModel;
