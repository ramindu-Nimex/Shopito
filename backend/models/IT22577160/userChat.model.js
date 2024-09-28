import mongoose from "mongoose";

const userChatsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  chats: [
    {
      _id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
}, { timestamps: true });

const UserChat = mongoose.model("UserChat", userChatsSchema);
export default UserChat;
