import sys
import numpy as np
from joblib import load
from sklearn.preprocessing import LabelEncoder, StandardScaler

# Load your saved model, scaler, and label encoders
kmeans = load('kmeans_model.joblib')
scaler = load('scaler.joblib')
label_encoders = load('label_encoders.joblib')

# User data passed from Node.js (sys.argv[1:] gives all the command-line arguments except the script name)
user_data = sys.argv[1:]  # Example: ['Male', 'Electronics', 'Mobile', 'New York', ...]

# Columns to be label encoded
label_cols = ['Gender', 'Item Purchased', 'Category', 'Location', 'Size', 'Color', 'Season',
              'Subscription Status', 'Shipping Type', 'Discount Applied', 'Promo Code Used', 'Payment Method', 'Frequency of Purchases']

# Numeric columns
numeric_cols = ['Age', 'Purchase Amount (USD)', 'Previous Purchases']

# Check if user data matches expected number of features
expected_features = len(label_cols) + len(numeric_cols)
if len(user_data) != expected_features:
    raise ValueError(f"Expected {expected_features} features, but got {len(user_data)}")

# Preprocessing the user data: Separate the categorical and numeric parts
categorical_data = user_data[:len(label_cols)]
numeric_data = list(map(float, user_data[len(label_cols):]))  # Convert numeric parts to float

# Encode the categorical data using pre-trained label encoders
encoded_data = []
for i, col in enumerate(label_cols):
    le = label_encoders[col]
    try:
        encoded_data.append(le.transform([categorical_data[i]])[0])
    except ValueError:
        print(f"Unseen label detected for {col}: '{categorical_data[i]}'")
        encoded_data.append(le.transform([le.classes_[0]])[0])  # Default fallback for unseen labels

# Combine the encoded categorical data with the numeric data
full_data = encoded_data + numeric_data

# Convert data to a numpy array and reshape it for the model
encoded_data_np = np.array(full_data).reshape(1, -1)

# Scale the data using the pre-trained scaler
user_data_scaled = scaler.transform(encoded_data_np)

# Ensure the number of features matches the model input
if user_data_scaled.shape[1] != kmeans.n_features_in_:
    raise ValueError(f"Mismatch in input feature dimensions. Expected {kmeans.n_features_in_}, got {user_data_scaled.shape[1]}")

# Predict the cluster using the KMeans model
cluster = kmeans.predict(user_data_scaled)

# Output the cluster to be read by Node.js
print(cluster[0])