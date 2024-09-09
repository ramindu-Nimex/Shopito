import Chat from "../../models/IT22577160/chat.model.js";
import UserChat from "../../models/IT22577160/userChat.model.js";

export const chats = async (req, res, next) => {
  const { text, userId } = req.body;
  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });
    const savedChat = await newChat.save();
    // CHECK IF THE USERCHATS EXISTS
    const userChats = await UserChat.find({ userId: userId });
    
    // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
    if (!userChats.length) {
        const newUserChats = new UserChat({
            userId: userId,
            chats: [
                {
                    _id: savedChat._id,
                    title: text.substring(0, 40),
                },
            ],
        });
        await newUserChats.save();
    } else {
        // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
        await UserChat.updateOne(
            { userId: userId },
            {
                $push: {
                    chats: {
                        _id: savedChat._id,
                        title: text.substring(0, 40),
                    },
                },
            }
        )
        res.status(201).send(newChat._id);
    }
  } catch (error) {
    next(error);
  }
};
