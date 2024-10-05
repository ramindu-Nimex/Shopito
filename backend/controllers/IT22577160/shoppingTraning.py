import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.cluster import KMeans
import pickle
import matplotlib.pyplot as plt
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA

# Load the dataset
file_path = 'D:/sliit/Sliit year 3 semester 1/SPM/shopping_behavior_updated.csv' 
df = pd.read_csv(file_path)

# Handle missing data
df['Location'] = df['Location'].fillna('Unknown')
df['Discount Applied'] = df['Discount Applied'].fillna('No')

# Preprocessing
categorical_cols = ['Gender', 'Item Purchased', 'Category', 'Location', 'Discount Applied']
for col in categorical_cols:
    df[col] = df[col].astype('object')

# Label Encoding for categorical variables
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Drop irrelevant features (Customer ID in this case)
df = df.drop(['Customer ID'], axis=1)

# Feature Scaling
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

# Plot Silhouette Scores for each cluster number
plt.figure(figsize=(8, 6))
plt.plot(range(2, 10), scores, marker='o')
plt.xlabel('Number of Clusters')
plt.ylabel('Silhouette Score')
plt.title('Silhouette Scores for Optimal Clusters')
plt.grid()
plt.show()

# Choose the optimal number of clusters (adjust based on silhouette scores)
optimal_clusters = 3
kmeans = KMeans(n_clusters=optimal_clusters, random_state=42)
df['Cluster'] = kmeans.fit_predict(df_scaled)

# Calculate preferences for each cluster
cluster_preferences = {}

for cluster in range(optimal_clusters):
    cluster_data = df[df['Cluster'] == cluster]
    
    # For categorical columns, calculate the mode (most frequent value)
    categorical_prefs = {col: label_encoders[col].inverse_transform([cluster_data[col].mode()[0]])[0]
                         for col in categorical_cols}
    
    # For numeric columns, calculate the mean and convert np.float64 to float
    numeric_prefs = {col: float(cluster_data[col].mean()) for col in ['Age', 'Purchase Amount (USD)', 'Previous Purchases']}
    
    # Combine preferences
    cluster_preferences[cluster] = {**categorical_prefs, **numeric_prefs}

# Save the model, scaler, label encoders, and cluster preferences using pickle
with open('kmeans_model.pkl', 'wb') as file:
    pickle.dump(kmeans, file)

with open('scaler.pkl', 'wb') as file:
    pickle.dump(scaler, file)

with open('label_encoders.pkl', 'wb') as file:
    pickle.dump(label_encoders, file)

with open('cluster_preferences.pkl', 'wb') as file:
    pickle.dump(cluster_preferences, file)

# PCA for 2D visualization
pca = PCA(n_components=2)
df_pca = pca.fit_transform(df_scaled)

# Create a scatter plot of the clusters
plt.figure(figsize=(10, 8))
plt.scatter(df_pca[:, 0], df_pca[:, 1], c=df['Cluster'], cmap='viridis', marker='o')
plt.title('Cluster Visualization using PCA')
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.colorbar(label='Cluster')
plt.grid()
plt.show()

print("Model trained and saved!")
