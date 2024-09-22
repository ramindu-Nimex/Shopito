import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from joblib import load

# Load your saved model, scaler, and label encoders
kmeans = load('kmeans_model.joblib')
scaler = load('scaler.joblib')
label_encoders = load('label_encoders.joblib')

# List of columns to be label encoded
label_cols = ['Gender', 'Item Purchased', 'Category', 'Location', 'Discount Applied']
numeric_cols = ['Age', 'Purchase Amount (USD)', 'Previous Purchases']

# Define the function to get the nearest cluster
def get_nearest_cluster(user_data, kmeans_model, scaler, label_encoders, label_cols, numeric_cols):
    if len(user_data) != len(label_cols) + len(numeric_cols):
        raise ValueError(f"User data must have {len(label_cols) + len(numeric_cols)} features, but got {len(user_data)}")

    # Separate user_data into categorical and numeric parts
    categorical_data = user_data[:len(label_cols)]
    numeric_data = user_data[len(label_cols):]

    # Encode categorical variables using the saved encoders
    encoded_data = []
    for i, col in enumerate(label_cols):
        le = label_encoders[col]
        try:
            encoded_data.append(le.transform([categorical_data[i]])[0])
        except ValueError:
            print(f"Unseen label detected for {col}: '{categorical_data[i]}'")
            encoded_data.append(le.transform([le.classes_[0]])[0])  # Default fallback

    # Append numeric data
    encoded_data.extend(numeric_data)

    # Convert encoded data to a numpy array
    encoded_data = np.array(encoded_data).reshape(1, -1)

    # Ensure the number of features matches the training data
    if encoded_data.shape[1] != len(label_cols) + len(numeric_cols):
        raise ValueError(f"Encoded data has {encoded_data.shape[1]} features, expected {len(label_cols) + len(numeric_cols)}")

    # Scale user data
    user_data_scaled = scaler.transform(encoded_data)
    
    # Predict the cluster
    cluster = kmeans_model.predict(user_data_scaled)
    
    return cluster[0]

# Example user data (make sure to provide values for all columns)
user_input = ['Female', 'Sunglasses', 'Accessories', 'Alabama', 'Yes', 50, 20, 0]  

#user_input = ['Female', 'Sunglasses', 'Accessories', 'Alabama', 'M', 'Yes', 50, 20, 0]  

# Get the predicted cluster
predicted_cluster = get_nearest_cluster(user_input, kmeans, scaler, label_encoders, label_cols, numeric_cols)

print(f'Predicted cluster: {predicted_cluster}')