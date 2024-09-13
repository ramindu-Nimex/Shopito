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
      );
      res.status(201).send(newChat._id);
    }
  } catch (error) {
    next(error);
  }
};

export const userChats = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const userChats = await UserChat.findOne({ userId });

    // Check if no userChats were found
    if (!userChats) {
      return res.status(404).send({ message: "No chats found for this user" });
    }

    res.status(200).send(userChats.chats);
  } catch (error) {
    next(error);
  }
};

export const userChatsById = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    res.status(200).send(chat);
  } catch (error) {
    next(error);
  }
};

export const userChatsByGetId = async (req, res, next) => {
  const userId = req.user.id;
  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    )
    res.status(200).send(updatedChat);
  } catch (error) {
    next(error);
  }
};