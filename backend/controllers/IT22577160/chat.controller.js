import Chat from "../../models/IT22577160/chat.model.js";
import UserChat from "../../models/IT22577160/userChat.model.js";
import InventoryAssist from "../../models/IT22577160/inventoryModel.js";
import ShopAssist from "../../models/IT22577160/shopListingModel.js";

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
    );
    res.status(200).send(updatedChat);
  } catch (error) {
    next(error);
  }
};

export const getFilteredProducts = async (req, res, next) => {
  const { productCategory, productName, budget, userId } = req.query;

  const budgetValue = parseInt(budget, 10);
  if (!budgetValue || isNaN(budgetValue)) {
    return res.status(400).json({ error: "Invalid budget input" });
  }

  try {
    const matchingProducts = await InventoryAssist.find({
      productCategory: { $regex: new RegExp(productCategory, "i") }, // Case-insensitive search
      productName: { $regex: new RegExp(productName, "i") }, // Case-insensitive search
      price: { $lte: parseInt(budget) },
      productStatus: "Available",
    });

    if (matchingProducts.length === 0) {
      return res
        .status(404)
        .send({ message: "No products found matching your criteria" });
    }

    // Get the unique shopIds from the matching products
    const shopIds = matchingProducts.map((product) => product.shopId);

    // Find all shops corresponding to the shopIds
    const shops = await ShopAssist.find({
      shopID: { $in: shopIds },
    });

    // Combine product and shop data
    const result = matchingProducts.map((product) => {
      const shop = shops.find((s) => s.shopID === product.shopId);
      return {
        shopName: shop?.shopName,
        shopLocation: shop?.shopLocation,
        isOpen: shop?.isOpen,
        shopOpeningHours: shop?.shopOpeningHours,
        productID: product.productID,
        productName: product.productName,
        productCategory: product.productCategory,
        productDescription: product.productDescription,
        price: product.price,
        quantity: product.quantity,
        productStatus: product.productStatus,
      };
    });

    res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    next(error);
  }
};

function predictCluster(userData, callback) {
  //Arguments to pass to the Python script
  const options = {
      mode: 'text',
      pythonPath: 'C:\Users\Ramindu\AppData\Local\Programs\Python\Python312\python.exe', // Path to your Python installation
      pythonOptions: ['-u'],
      scriptPath: './', // Path to the folder where your Python script is located
      args: userData // Pass the user data to the Python script
  };

  PythonShell.run('apply.py', options, function (err, results) {
      if (err) throw err;3333333
      // Results from the Python script
      console.log('Predicted cluster:', results);
      callback(results);
  });
}


export const createInventoryItem = async (req, res, next) => {
  try {
    const newInventoryItem = new InventoryAssist(req.body);
    const inventoryItem = await newInventoryItem.save();
    res.status(201).json(inventoryItem);
  } catch (error) {
    next(error);
  }
};

export const createShop = async (req, res, next) => {
  try {
    const newShop = new ShopAssist(req.body);
    const shop = await newShop.save();
    res.status(201).json(shop);
  } catch (error) {
    next(error);
  }
};
