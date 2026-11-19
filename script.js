let model = null;

const resultBox = document.getElementById("result");

function showResult(html, isError = false) {
  resultBox.innerHTML = html;
  resultBox.classList.remove("hidden");
  resultBox.classList.toggle("error", isError);
}

function capitalise(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function loadModel() {
  try {
    const response = await fetch("model/iris_model.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    model = await response.json();
  } catch (error) {
    showResult(
      "Could not load the model file. If you opened this page by double-clicking it, " +
      "run it through a local server instead (for example VS Code Live Server).",
      true
    );
    console.error(error);
  }
}

function readInputs() {
  const values = [];
  for (const feature of model.features) {
    const input = document.getElementById(feature);
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);

    if (isNaN(value)) {
      throw new Error("Please fill in every box.");
    }
    if (value < min || value > max) {
      throw new Error(
        `${feature.replace("_", " ")} should be between ${min} and ${max} cm.`
      );
    }
    values.push(value);
  }
  return values;
}

function predictKNN(rawValues) {
  // Scale the input exactly as the training data was scaled
  const scaled = rawValues.map(
    (v, i) => (v - model.scaler_mean[i]) / model.scaler_scale[i]
  );

  // Distance from the input to every training flower
  const distances = model.X_train.map((row, index) => {
    let sum = 0;
    for (let i = 0; i < row.length; i++) {
      sum += (row[i] - scaled[i]) ** 2;
    }
    return { distance: Math.sqrt(sum), label: model.y_train[index] };
  });

  // Take the k closest and let them vote
  distances.sort((a, b) => a.distance - b.distance);
  const neighbours = distances.slice(0, model.k);

  const votes = {};
  model.classes.forEach((c) => (votes[c] = 0));
  neighbours.forEach((n) => votes[n.label]++);

  // Highest vote wins; on a tie the first class in the list wins
  let winner = model.classes[0];
  model.classes.forEach((c) => {
    if (votes[c] > votes[winner]) winner = c;
  });

  return { winner, votes };
}

document.getElementById("predict-btn").addEventListener("click", () => {
  if (!model) {
    showResult("The model has not loaded yet. Please wait a moment and try again.", true);
    return;
  }
  try {
    const values = readInputs();
    const { winner, votes } = predictKNN(values);

    const voteText = model.classes
      .map((c) => `${capitalise(c)}: ${votes[c]} of ${model.k}`)
      .join(" | ");

    showResult(
      `<strong>Predicted species: ${capitalise(winner)}</strong><br>` +
      `<small>Votes from the ${model.k} nearest flowers: ${voteText}</small>`
    );
  } catch (error) {
    showResult(error.message, true);
  }
});

document.getElementById("clear-btn").addEventListener("click", () => {
  ["sepal_length", "sepal_width", "petal_length", "petal_width"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
  resultBox.classList.add("hidden");
});

loadModel();