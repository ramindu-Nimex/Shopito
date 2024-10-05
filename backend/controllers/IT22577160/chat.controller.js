import Chat from "../../models/IT22577160/chat.model.js";
import UserChat from "../../models/IT22577160/userChat.model.js";
import InventoryAssist from "../../models/IT22577160/inventoryModel.js";
import ShopAssist from "../../models/IT22577160/shopListingModel.js";
import User from "../../models/user.model.js";

import { PythonShell } from "python-shell";
import { spawn } from "child_process";

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
  const { productCategory, productName, budget, userId, Discount_Applied } = req.query;

  try {
    const user = await User.findOne({ _id: userId });
    const pascelCaseProductName = toPascalCase(productName);
    const userData = [
      user.gender,
      pascelCaseProductName,
      productCategory,
      "Alabama",
      Discount_Applied,
      50,
      parseInt(budget),
      0,
    ];

    let clusterResult = await new Promise((resolve, reject) => {
      predictCluster(userData, (result) => {
        if (result.error) {
          return reject(result.error);
        }
        resolve(result); // resolve the result from the Python script
      });
    });

    const budgetValue = parseInt(budget, 10);
    if (!budgetValue || isNaN(budgetValue)) {
      return res.status(400).json({ error: "Invalid budget input" });
    }

    if (typeof clusterResult === "string") {
      clusterResult = JSON.parse(clusterResult);
    }

    const preferences = clusterResult?.preferences;
    if (!preferences) {
      return res
        .status(400)
        .json({ error: "Preferences not available in cluster result" });
    }

    const discountApplied = preferences["Discount Applied"];
    const category = preferences["Category"];

    const preferencesData = await InventoryAssist.find({
      Discount_Applied:
        discountApplied === "No" ? { $in: ["Yes", "No"] } : "Yes",
      productCategory: { $regex: new RegExp(category, "i") },
      price: { $lte: parseInt(budget) },
      productStatus: "Available",
    });

    const matchingProducts = await InventoryAssist.find({
      productCategory: { $regex: new RegExp(productCategory.toLowerCase(), "i") }, // Case-insensitive search
      productName: { $regex: new RegExp(productName.toLowerCase(), "i") }, // Case-insensitive search
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
    const preferedShopIds = preferencesData.map(
      (preferedProduct) => preferedProduct.shopId
    );

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

    const prefShops = await ShopAssist.find({
      shopID: { $in: preferedShopIds }, // Change to shopID
    });

    const preferedResult = preferencesData.map((preferedProduct) => {
      const prefShop = prefShops.find(
        (s) => s.shopID === preferedProduct.shopId
      );
      return {
        shopName: prefShop?.shopName,
        shopLocation: prefShop?.shopLocation,
        isOpen: prefShop?.isOpen,
        shopOpeningHours: prefShop?.shopOpeningHours,
        productID: preferedProduct.productID,
        productName: preferedProduct.productName,
        productCategory: preferedProduct.productCategory,
        productDescription: preferedProduct.productDescription,
        price: preferedProduct.price,
        quantity: preferedProduct.quantity,
        productStatus: preferedProduct.productStatus,
      };
    });

    const finalResponse = {
      matchingProducts: result,
      preferredProducts: preferedResult,
    };

    res.status(200).send(finalResponse);
  } catch (error) {
    console.error("Error fetching products:", error);
    next(error);
  }
};

const toPascalCase = (str) => {
  return str
    .split(/[\s_]+/) // Split by spaces or underscores
    .map((word) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize the first letter of each word
    )
  .join('');
};

// Function to run the Python script and get the output
function predictCluster(userData, callback) {
  // Convert the userData array to string format
  const userDataArgs = userData.map(String);

  //const pythonProcess = spawn('python', ['D:/Yr-03,Sem-01/Shopito/backend/controllers/IT22577160/apply.py']);
  const pythonProcess = spawn('python', ['D:/sliit/Sliit year 3 semester 1/SPM/Shopito/backend/controllers/IT22577160/apply.py', ...userDataArgs]);

  let dataString = '';

  // Collect data from the Python script
  pythonProcess.stdout.on('data', (data) => {
    dataString += data.toString(); // Accumulate the output
  });

  // Handle the end of the Python script
  pythonProcess.stdout.on('end', () => {
    //console.log('Output from Python script:', dataString.trim()); // Log the result
    callback(dataString.trim()); // Return the result via callback
  });

  // Handle errors from the Python script
  pythonProcess.stderr.on('data', (data) => {
    console.error('Error from Python script:', data.toString());
    callback({ error: 'Error executing Python script' });
  });
}

function predictCluster_(userData, callback) {
  // Arguments to pass to the Python script
  const options = {
    mode: 'text',
    pythonPath: 'C:/Users/Ramindu/AppData/Local/Programs/Python/Python312/python.exe', // Path to the Python executable
    pythonOptions: ['-u'],
    scriptPath: './', // Path to the folder where your Python script is located
    args: userData // Pass the user data to the Python script
  };

  console.log('Executing Python script with args:', userData); // Add this line for debugging

  // Run the Python script
  PythonShell.run('D:/sliit/Sliit year 3 semester 1/SPM/Shopito/backend/controllers/IT22577160/apply.py', options, function (err, results) {
    if (err) {
      console.error('Python shell error:', err);
      return callback({ error: 'Error executing Python script' });
    }

    if (results) {
      // Join the results into a single string
      const jsonString = results.join('');
      console.log('Results from Python script:', jsonString); // Log the raw results

      try {
        // Parse the JSON string
        const jsonOutput = JSON.parse(jsonString);
        console.log('Predicted cluster:', jsonOutput.predicted_cluster);
        console.log('Preferences:', jsonOutput.preferences);

        // Pass the parsed output to the callback
        callback(jsonOutput);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        callback({ error: 'Error parsing JSON from Python script' });
      }
    } else {
      console.error('No results from Python script');
      callback({ error: 'No results from Python script' });
    }
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

