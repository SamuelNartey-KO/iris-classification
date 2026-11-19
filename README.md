# Iris Species Classifier

A web application that predicts the species of an iris flower (setosa, versicolor or virginica) from its sepal and petal measurements.

**Live site:** https://SamuelNartey-KO.github.io/iris-classification/

## About the project

- **Dataset:** Iris dataset supplied by the lecturer (150 samples, 4 features, 3 classes)
- **Model:** K-Nearest Neighbours (k = 5), chosen from Logistic Regression, KNN and Decision Tree using 5-fold cross-validation
- **Training:** Python and scikit-learn in Google Colab
- **Website:** hand-built with HTML, CSS and JavaScript. The model is exported as JSON and the prediction runs in the browser.

## Test set results (30 flowers)

| Metric    | Score  |
|-----------|--------|
| Accuracy  | 93.33% |
| Precision | 94.44% |
| Recall    | 93.33% |
| F1 score  | 93.27% |

## Repository structure

- `data/` - the Iris dataset
- `notebooks/` - the Colab notebook (exploration, training, evaluation)
- `images/` - graphs used in the report and website
- `model/` - exported model (`iris_model.json`)
- `index.html`, `style.css`, `script.js` - the website

## Run it locally

Serve the folder with a local server (for example VS Code Live Server, or `python -m http.server 8000`) and open `index.html`. Opening the file directly will not work, because browsers block reading the model file.

## Author

Nartey Samuel