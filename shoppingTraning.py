import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.cluster import KMeans
from joblib import dump
import matplotlib.pyplot as plt
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA

# Load the dataset
file_path = 'D:/sliit/Sliit year 3 semester 1/SPM/shopping_behavior_updated.csv' 
df = pd.read_csv(file_path)  # Replace with your actual file path

# Preprocessing - Label Encoding for categorical variables
label_cols = ['Gender', 'Item Purchased', 'Category', 'Location', 'Discount Applied']
numeric_cols = ['Age', 'Purchase Amount (USD)', 'Previous Purchases']

label_encoders = {}
for col in label_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Drop irrelevant features (Customer ID in this case)
df = df.drop(['Customer ID'], axis=1)

# Feature Scaling (Standardize the data)
scaler = StandardScaler()
df_scaled = scaler.fit_transform(df)

# Determine optimal number of clusters using Silhouette Score
scores = []
for n in range(2, 10):
    kmeans = KMeans(n_clusters=n, random_state=42)
    kmeans.fit(df_scaled)
    labels = kmeans.labels_
    score = silhouette_score(df_scaled, labels)
    scores.append(score)

plt.figure(figsize=(8, 6))
plt.plot(range(2, 10), scores, marker='o')
plt.xlabel('Number of Clusters')
plt.ylabel('Silhouette Score')
plt.title('Elbow Method for Optimal Clusters')
plt.show()

# Choose the optimal number of clusters (based on plot results, e.g., 3)
optimal_clusters = 3
kmeans = KMeans(n_clusters=optimal_clusters, random_state=42)
df['Cluster'] = kmeans.fit_predict(df_scaled)

# Save the model, scaler, and label encoders for later use
dump(kmeans, 'kmeans_model.joblib')
dump(scaler, 'scaler.joblib')
dump(label_encoders, 'label_encoders.joblib')


# --- PCA for 2D visualization ---
pca = PCA(n_components=2)  # Reduce the data to 2 dimensions
df_pca = pca.fit_transform(df_scaled)

# Create a scatter plot of the clusters
plt.figure(figsize=(10, 8))
plt.scatter(df_pca[:, 0], df_pca[:, 1], c=df['Cluster'], cmap='viridis', marker='o')
plt.title('Cluster Visualization using PCA')
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.colorbar(label='Cluster')
plt.show()

print("Model trained and saved!")