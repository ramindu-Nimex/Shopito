import { PythonShell } from 'python-shell';
import User from '../../models/user.model.js';

// Function to predict cluster using Python model
export default function predictCluster(userData, callback) {
    // // Arguments to pass to the Python script
    // const options = {
    //     mode: 'text',
    //     pythonPath: 'C:\Users\DELL\AppData\Local\Programs\Python\Python313\python.exe', // Path to your Python installation
    //     pythonOptions: ['-u'],
    //     scriptPath: './', // Path to the folder where your Python script is located
    //     args: userData // Pass the user data to the Python script
    // };

    // PythonShell.run('predict_cluster.py', options, function (err, results) {
    //     if (err) throw err;3333333
    //     // Results from the Python script
    //     console.log('Predicted cluster:', results);
    //     callback(results);
    // });
}


// Example user data to be passed
// Query the inventory
// const userData1 = await User.find({
//     username: username,
//     productName: productName,
//     price: { $lte: parseInt(budget) },
//     productStatus: "Available"
//   });
const chats = async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findOne({ userId });


    //const userData = [user.userId, 'Sunglasses', 'Accessories', 'shoplocation', 'discoubnted', age, budget, amount];
    //const userData = ['Female', 'Sunglasses', 'Accessories', 'Alabama', 'M', 'Yes', 50, 20, 0]  

    const userData11 = ['Male', 'Electronics', 'Mobile', 'Urban', 'Large', 'Black', 'Winter', 'Subscribed', 'Fast', 'Yes', 'No', 'Credit Card', 5];

}



const userData = ['Male', 'Electronics', 'Mobile', 'Urban', 'Large', 'Black', 'Winter', 'Subscribed', 'Fast', 'Yes', 'No', 'Credit Card', 5];

// Call the function and get the cluster
predictCluster(userData, (predictedCluster) => {
    console.log(`User belongs to cluster: ${predictedCluster}`);
    // Here, you can proceed with querying the database based on the predicted cluster
});