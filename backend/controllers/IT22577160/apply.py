import pandas as pd
import json
from joblib import load
import pickle
import json
import sys

# Load the saved model, scaler, label encoders, and cluster preferences
with open('D:/sliit/Sliit year 3 semester 1/SPM/Shopito/backend/controllers/IT22577160/kmeans_model.pkl', 'rb') as file:
    kmeans = pickle.load(file)

with open('D:/sliit/Sliit year 3 semester 1/SPM/Shopito/backend/controllers/IT22577160/scaler.pkl', 'rb') as file:
    scaler = pickle.load(file)

with open('D:/sliit/Sliit year 3 semester 1/SPM/Shopito/backend/controllers/IT22577160/label_encoders.pkl', 'rb') as file:
    label_encoders = pickle.load(file)

with open('D:/sliit/Sliit year 3 semester 1/SPM/Shopito/backend/controllers/IT22577160/cluster_preferences.pkl', 'rb') as file:
    cluster_preferences = pickle.load(file)

# List of columns to be label encoded
label_cols = ['Gender', 'Item Purchased', 'Category', 'Location', 'Discount Applied']
numeric_cols = ['Age', 'Purchase Amount (USD)', 'Previous Purchases']
all_cols = label_cols + numeric_cols

# Function to get the nearest cluster and its preferences
def get_nearest_cluster_with_preferences(user_data, kmeans_model, scaler, label_encoders, cluster_prefs, label_cols, numeric_cols):
    if len(user_data) != len(label_cols) + len(numeric_cols):
        raise ValueError(f"User data must have {len(label_cols) + len(numeric_cols)} features, but got {len(user_data)}")

    # Separate user_data into categorical and numeric parts
    categorical_data = user_data[:len(label_cols)]
    numeric_data = user_data[len(label_cols):]

    # Encode categorical variables using the saved encoders
    encoded_data = []
    for i, col in enumerate(label_cols):
        le = label_encoders[col]
        if categorical_data[i] in le.classes_:
            encoded_data.append(le.transform([categorical_data[i]])[0])
        else:
            print(f"Unseen label detected for {col}: '{categorical_data[i]}'. Defaulting to first class.")
            encoded_data.append(le.transform([le.classes_[0]])[0])

    # Append numeric data
    encoded_data.extend(numeric_data)

    # Convert encoded data to a DataFrame with correct order
    encoded_data_df = pd.DataFrame([encoded_data], columns=all_cols)

    # Ensure the columns are in the same order as when the scaler was fitted
    encoded_data_df = encoded_data_df[scaler.feature_names_in_]

    # Scale user data
    user_data_scaled = scaler.transform(encoded_data_df)

    # Predict the cluster
    predicted_cluster = kmeans_model.predict(user_data_scaled)[0]

    # Retrieve preferences for the predicted cluster
    preferences = cluster_prefs[predicted_cluster]
    
    return predicted_cluster, preferences

# Example user data to test
user_input_1 = sys.argv[1:] 
#user_input_1 = ['Female', 'Dress', 'Clothing', 'New York', 'Yes', 30, 10, 4]  # Example input
predicted_cluster_1, preferences_1 = get_nearest_cluster_with_preferences(user_input_1 , kmeans, scaler, label_encoders, cluster_preferences, label_cols, numeric_cols)

# Return the results as JSON
output = {
    'predicted_cluster': int(predicted_cluster_1),  # Convert to int
    'preferences': preferences_1  # Ensure preferences are of native types
}

# Print the JSON output
print(json.dumps(output))  # Serialize to JSON string and print