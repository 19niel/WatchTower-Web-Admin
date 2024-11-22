import sys
import pickle
import pandas as pd

# Load the model and vectorizer
with open('priority_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('tfidf_vectorizer.pkl', 'rb') as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

# Get inputs from command line arguments
disaster_category = sys.argv[1]
disaster_info = sys.argv[2]

# Prepare input data
input_data = pd.DataFrame({
    'disasterCategory': [disaster_category],
    'disasterInfo': [disaster_info]
})

# Combine category and info for vectorization
input_data['combined'] = input_data['disasterCategory'] + " " + input_data['disasterInfo']
input_features = vectorizer.transform(input_data['combined'])

# Predict priority
predicted_priority = model.predict(input_features)[0]

# Output the prediction
print(predicted_priority)
