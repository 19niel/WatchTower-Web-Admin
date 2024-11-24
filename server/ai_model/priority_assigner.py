import sys
import os
import pickle
import pandas as pd

# Get the absolute path of the current script's directory
script_dir = os.path.dirname(os.path.realpath(__file__))

# Absolute paths for model and vectorizer
model_path = os.path.join(script_dir, 'priority_model.pkl')
vectorizer_path = os.path.join(script_dir, 'tfidf_vectorizer.pkl')

# Load the model and vectorizer
try:
    with open(model_path, 'rb') as model_file:
        model = pickle.load(model_file)
except FileNotFoundError:
    print(f"Error: The model file was not found at {model_path}")
    sys.exit(1)

try:
    with open(vectorizer_path, 'rb') as vectorizer_file:
        vectorizer = pickle.load(vectorizer_file)
except FileNotFoundError:
    print(f"Error: The vectorizer file was not found at {vectorizer_path}")
    sys.exit(1)

# Get inputs from command line arguments
if len(sys.argv) < 3:
    print("Error: Missing input arguments (disasterCategory, disasterInfo)")
    sys.exit(1)

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
