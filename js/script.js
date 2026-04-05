// --- GLOBAL STATE VALUES ---

const state = {
  data: [],
  chartData: [],
  errorMessages: {
    "Empty, caffeine" : "No caffeine amount...",
    "Empty, weight": "No body mass... ethereal...",
    "Empty, drink": "No drink name...",
    "Symbols, weight": "Symbols in body mass? Unacceptable...",
    "Undefined": "Undefined error"
  },
  userData: {
    "bodyMass": 0,
    "metabolismSpeedDisplay": "Medium",
    "metabolismSpeed": 0,
    "currentCaffeineLevel": 0
  },
  customDrink: false,
  inputFields: [
    "bodyMassBox",
    "metabolismSpeedSelect",
    "timeInputBox",
    "presetDrinkSelect",
    "customDrinkCheckBox",
    "customDrinkNameBox",
    "customDrinkCaffeineBox"
  ],
  presetDrinks: {
    "Filter coffee": 110,
    "Espresso": 65,
    "Double espresso": 130,
    "Latte": 65,
    "Cappuccino": 65,
    "Flat white": 130,
    "Black tea (300ml)": 60,
    "Green tea (300ml)": 40,
    "Energy drink (250ml)": 75,
    "Energy drink (500ml)": 150
  },
  metabolismSpeed: {
    "High": 3.5,
    "Medium": 5.7,
    "Low": 7.5
  },
  defaultTableValues: [
    "Time",
    "Drink",
    "Caffeine, mg"
  ],
  graphValues: {
    "timePeriodHH": 30,
    "points": 60 * 30, // 60 points per hour
  },
};

let caffeineChart;

// --- HELPER FUNCTIONS ---

// create option values for select input type
const createSelectOptions = (valueObject, selectElement) => {
  const objectKeys = Object.keys(valueObject)
  objectKeys.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    selectElement.append(option);
  });
};

// --- UI RENDERING ---

const tableWithDefaultValues = (tableValues, container) => {
  const table = document.createElement("table");
  table.id = "ValuesTable"

  const labelsRow = document.createElement("tr");
  let emptyValuesArr = []

  tableValues.forEach((label) => {
    const headingCell = document.createElement("th");
    headingCell.textContent = label;
    labelsRow.append(headingCell);
    emptyValuesArr.push("")
  });

  table.append(labelsRow);

  const valuesRow = document.createElement("tr");

  emptyValuesArr.forEach((entry) => {
    const dataCell = document.createElement("td");
    dataCell.textContent = entry;
    valuesRow.append(dataCell);
  });

  table.append(valuesRow)

  container.innerHTML = "";
  container.append(table);
};

const renderDataTable = (arrayOfValueObjects, container) => {
  console.log("creating table")
  const table = document.createElement("table");
  table.id = "ValuesTable"

  const keyLabels = Object.keys(arrayOfValueObjects[0]);
  const labelsRow = document.createElement("tr");

  keyLabels.forEach((key) => {
    const headingCell = document.createElement("th");
    headingCell.textContent = key;
    labelsRow.append(headingCell);
  });
  table.append(labelsRow);

  arrayOfValueObjects.forEach((entry, index) => {
    const valuesRow = document.createElement("tr");
    const valuesArr = Object.values(arrayOfValueObjects[index]);
    valuesArr.forEach((value) => {
      const dataCell = document.createElement("td");
      dataCell.textContent = value;
      valuesRow.append(dataCell);
    });
    table.append(valuesRow)
  });

  container.innerHTML = "";
  container.append(table);
};

function renderUI() {
  // --- access main containers ---
  const inputContainer = document.getElementById("inputContainer");
  const dataContainer = document.getElementById("dataContainer");

  // --- create subcontainers ---
  
  // message container
  const errorMessageContainer = document.createElement("div");

  // data input
  const presetDrinkContainer = document.createElement("div");
  const customDrinkContainer = document.createElement("div");
  const userInfoContainer = document.createElement("div");
  const buttonsContainer = document.createElement("div");
  
  // data present
  const dataValuesContainer = document.createElement("div");
  const graphContainer = document.createElement("div");

  // data values sub-subcontainers
  const actualDataContainer = document.createElement("div");
  const drinkTableContainer = document.createElement("div");

  // actualDataContainer subcontainers

  const bodyMassContainer = document.createElement("div");
  const metabolismSpeedContainer = document.createElement("div");
  const currentCaffeineContainer = document.createElement("div");
  
  // --- assign classes and add to main containers ---

  // assign classes to data input subcontainers
  presetDrinkContainer.classList.add("inputSubContainer");
  customDrinkContainer.classList.add("inputSubContainer");
  userInfoContainer.classList.add("inputSubContainer");
  buttonsContainer.classList.add("inputSubContainer");
  errorMessageContainer.classList.add("inputSubContainer");

  // assign classes to data presenting subcontainers
  dataValuesContainer.classList.add("dataSubContainer")
  graphContainer.classList.add("dataSubContainer")

  // assign classes to data value subcontainers
  actualDataContainer.classList.add("dataValuesSubContainer")
  drinkTableContainer.classList.add("graphSubContainer")
  bodyMassContainer.classList.add("actualDataSubContainer")
  metabolismSpeedContainer.classList.add("actualDataSubContainer")
  currentCaffeineContainer.classList.add("actualDataSubContainer")

  // add subcontainers to main containers
  inputContainer.append(
    errorMessageContainer,
    presetDrinkContainer, 
    customDrinkContainer, 
    userInfoContainer, 
    buttonsContainer
  );
  dataContainer.append(
    dataValuesContainer, 
    graphContainer
  );
  dataValuesContainer.append(
    actualDataContainer,
    drinkTableContainer
  );
  actualDataContainer.append(
    bodyMassContainer,
    metabolismSpeedContainer,
    currentCaffeineContainer
  );

  // default content of data containers

  tableWithDefaultValues(state.defaultTableValues, drinkTableContainer);
  bodyMassContainer.textContent = state.userData["bodyMass"];
  metabolismSpeedContainer.textContent = state.userData["metabolismSpeedDisplay"];
  currentCaffeineContainer.textContent = state.userData["currentCaffeineLevel"];

  // --- create input elements and append to subcontainers ---
  // time and preset drink
  const timeInputBox = document.createElement("input");
  Object.assign(timeInputBox, {
    type: "time",
    id: "timeInput",
    required: true
  });
  
  const presetDrinkSelect = document.createElement("select");
  createSelectOptions(
    state.presetDrinks, 
    presetDrinkSelect
  );
  Object.assign(presetDrinkSelect, {
    name: "selectedDrink",
    id: "presetDrinkSelect",
    required: true
  });

  presetDrinkContainer.append(
    timeInputBox, 
    presetDrinkSelect
  );

  // custom drink
  const customDrinkNameBox = document.createElement("input");
  Object.assign(customDrinkNameBox, {
    type: "text",
    name: "customDrink",
    value: "",
    id: "customDrinkName",
    placeholder: "Coffee"
  });
  
  const customDrinkCaffeineBox = document.createElement("input");
   Object.assign(customDrinkCaffeineBox, {
    type: "text",
    name: "customCaffeineAmount",
    value: "",
    id: "customCaffeine",
    placeholder: "100"
   });

  const customDrinkCheckBox = document.createElement("input");
  Object.assign(customDrinkCheckBox, {
    type: "checkbox",
    name: "customDrink",
    id: "customDrinkCheckbox"
  });

  customDrinkContainer.append(
    customDrinkCheckBox, 
    customDrinkNameBox, 
    customDrinkCaffeineBox
  );

  // user info
  const bodyMassBox = document.createElement("input");
  Object.assign(bodyMassBox, {
    type: "text",
    name: "bodyMass",
    value: "",
    id: "bodyMass",
    placeholder: "70"
  });
  const metabolismSpeedSelect = document.createElement("select");
  createSelectOptions(
    state.metabolismSpeed, 
    metabolismSpeedSelect
  );
  Object.assign(metabolismSpeedSelect, {
    name: "selectedDrink",
    id: "metabolismSpeedSelect",
    required: true
  });
  const userInfoSaveButton = document.createElement("button");
  Object.assign(userInfoSaveButton, {
    name: "saveUserInfo",
    id: "userInfoSaveButton",
    textContent: "Update"
  });

  userInfoContainer.append(
    bodyMassBox, 
    metabolismSpeedSelect,
    userInfoSaveButton
  );

  // main controls
  const addDataButton = document.createElement("button");
  Object.assign(addDataButton, {
    name: "addData",
    id: "addDataButton",
    textContent: "Add data"
  });
  const clearDataButton = document.createElement("button");
  Object.assign(clearDataButton, {
    name: "clearData",
    id: "clearDataButton",
    textContent: "Clear data"
  });
  const showGraphButton = document.createElement("button");
  Object.assign(showGraphButton, {
    name: "showGraph",
    id: "showGraphButton",
    textContent: "Show graph"
  }); 

  buttonsContainer.append(
    addDataButton, 
    clearDataButton,
    showGraphButton
  );

  return { 
    inputContainer,
    dataContainer,
    errorMessageContainer, 
    presetDrinkContainer, 
    userInfoContainer, 
    buttonsContainer, 
    dataValuesContainer, 
    graphContainer, 
    actualDataContainer, 
    drinkTableContainer, 
    bodyMassBox, 
    metabolismSpeedSelect, 
    userInfoSaveButton, 
    addDataButton, 
    clearDataButton, 
    showGraphButton,
    timeInputBox,
    presetDrinkSelect,
    customDrinkNameBox,
    customDrinkCaffeineBox,
    customDrinkCheckBox,
    bodyMassContainer,
    metabolismSpeedContainer,
    currentCaffeineContainer
 }
};
// --- RENDER GRAPH ---

const parseIntakeData = (intakeData) => {
  console.log("Parsing intake data.");
  let parsedIntakeData = [];

  intakeData.forEach((entry) => { // format data
    let valuePair = [];
    valuePair.push(timeToDecInt(entry["Time"]));
    valuePair.push(entry["Caffeine, mg"]);
    parsedIntakeData.push(valuePair);
  });
  parsedIntakeData = parsedIntakeData.sort(function(a, b){return a[0] - b[0]})
  console.log("Intake data parsed:" + parsedIntakeData);
  return parsedIntakeData
};
const createXValueArray = (start, end, pointsAmount) => {
  console.log("Creating array of X values.");
  const step = (end - start) / (pointsAmount - 1);
  const xArray = [];

  for (let i = 0; i < pointsAmount; i++) {
    xArray.push(start + (i * step))
  };
  console.log("Created array of X values:" + xArray);
  return xArray
};
const caffeineConcentration = (caffeineMg, bodyMass) => { 
  const caffeineVolumeOfDistribution = 0.6;
  return caffeineMg / (bodyMass * caffeineVolumeOfDistribution)
};
const intakeContribution = (time, intakeTime, intakeConcentration, absorptionTime, metabolismSpeed) => {
  if (time < intakeTime) {
	  return 0;
  } else if (time <= (intakeTime + absorptionTime)) {
    return ((intakeConcentration / absorptionTime) * (time - intakeTime));
  } else if (time > (intakeTime + absorptionTime)) {
    return (intakeConcentration * (0.5 ** ((time - (intakeTime + absorptionTime)) / metabolismSpeed)));
  }
};
const createXYArray = (intakeData, userData) => {
  const parsedIntakeData = parseIntakeData(intakeData);
  const bodyMass = userData["bodyMass"];
  const metabolismSpeed = userData["metabolismSpeed"];

  const graphStart = parsedIntakeData[0][0] - 1; // the time of the first intake minus one hour
  const graphEnd = state.graphValues["timePeriodHH"];
  const graphPoints = state.graphValues["points"];

  const timePoints = createXValueArray(graphStart, graphEnd, graphPoints);

  let totalConcentration = timePoints.map((time) => {
    return parsedIntakeData.reduce((sum, intake) => {
      return sum + intakeContribution(
        time,
        intake[0],
        caffeineConcentration(intake[1], bodyMass),
        0.75,
        metabolismSpeed
      );
    }, 0);
  });
  console.log(totalConcentration)

  //const xyPairs = xs.map((x, i) => [x, totalConcentration[i]]);

  return { 
    totalConcentration,
    timePoints
  }
};
const renderGraph = (container) => {
  const canvasContainer = document.createElement("canvas");
  canvasContainer.id = "caffeineChart";
  container.append(canvasContainer);
  const defaultTimePoints = createXValueArray(0, 24, 24*60);
  caffeineChart = new Chart(canvasContainer , {
    type: 'line',
    data: {
      labels: defaultTimePoints,
      datasets: [{
        label: 'Caffeine concentration, mg',
        data: [],
        borderWidth: 1
      }]
    },
  });
};

// --- render UI ---

const ui = renderUI();
const renderGraph(ui.graphContainer)

// --- ERROR HANDLING ---

const checkInputText = (textInput, inputType) => {
  const regex = /[^A-Za-z0-9]/; //used to check for special characters, optional
  let errorMessage = "";
  let inputValid = false;
  let errorType = "";

  if (textInput.length === 0 || textInput === null) {
    errorType = "Empty," + inputType;
    errorMessage = state.errorMessages[errorType];
    ui.errorMessageContainer.textContent = errorMessage;

    inputValid = false;

    setTimeout(() => {
      ui.errorMessageContainer.textContent = "";
    }, 5000);
    return inputValid
  } else {
    inputValid = true
    return inputValid
  };
};

const checkInputNumber = (numberInput, inputType) => {
  const regex = /[^0-9]/; //used to check for special characters or letters
  let errorMessage = "";
  let inputValid = false;
  let errorType = "";

  if (numberInput.length === 0 || numberInput === null || numberInput < 0) {
    errorType = "Empty," + inputType;
    errorMessage = state.errorMessages[errorType];
    ui.errorMessageContainer.textContent = errorMessage;
    console.log(errorMessage)
    inputValid = false;
    return inputValid
  } else if (regex.test(numberInput)) {
    errorType = "Symbols," + inputType;
    errorMessage = state.errorMessages[errorType];
    ui.errorMessageContainer.textContent = errorMessage;
    console.log(errorMessage)
    inputValid = false;
    return inputValid
  } else {
    inputValid = true;
    return inputValid
  };

  setTimeout(() => {
    ui.errorMessageContainer.textContent = "";
  }, 5000);
};

// --- DATA PARSING ---

const timeToDecInt = (timeInput) => {
  const hoursInt = parseInt(timeInput.slice(0, 2));
  const minutesInt = parseInt(timeInput.slice(-2));
  const timeDec = ((Math.round((hoursInt + (minutesInt / 60)) * 100)) / 100)
  return timeDec
};

// containers

const drinkTableContainer = ui.drinkTableContainer;
const bodyMassContainer = ui.bodyMassContainer;
const metabolismSpeedContainer = ui.metabolismSpeedContainer;
const currentCaffeineContainer = ui.currentCaffeineContainer;

// --- USER ACTIONS ---
// access input fields
const bodyMass = ui.bodyMassBox;
const metabolismSpeed = ui.metabolismSpeedSelect;
const timeInput = ui.timeInputBox;
const customDrinkName = ui.customDrinkNameBox;
const customDrinkCaffeine = ui.customDrinkCaffeineBox;
const presetDrink = ui.presetDrinkSelect;

// checkbox action
const customDrinkCheckBox = ui.customDrinkCheckBox;

customDrinkCheckBox.addEventListener("change", () => {
  if (customDrinkCheckBox.checked) {
    state.customDrink = true;
    customDrinkName.disabled = false;
    customDrinkCaffeine.disabled = false;
    presetDrink.disabled = true;
  } else {
    state.customDrink = false;
    customDrinkName.disabled = true;
    customDrinkCaffeine.disabled = true;
    presetDrink.disabled = false;
  };

});

// --- button actions ---
// access buttons
const addDataButton = ui.addDataButton;
const clearDataButton = ui.clearDataButton;
const showGraphButton = ui.showGraphButton;
const userInfoSaveButton = ui.userInfoSaveButton;

userInfoSaveButton.addEventListener("click", () => {
  let bodyMassValue = bodyMass.value;
  let metabolismSpeedValue = metabolismSpeed.value;
  let bodyMassInputValid = checkInputNumber(bodyMassValue, " weight");

  if (bodyMassInputValid) {
    state.userData.bodyMass = bodyMassValue;
  };

  state.userData.metabolismSpeedDisplay = metabolismSpeedValue;
  state.userData.metabolismSpeed = state.metabolismSpeed[metabolismSpeedValue];
  console.log(state.userData)

  bodyMassContainer.textContent = state.userData["bodyMass"];
  metabolismSpeedContainer.textContent = state.userData["metabolismSpeedDisplay"];
  currentCaffeineContainer.textContent = state.userData["currentCaffeineLevel"];
});

addDataButton.addEventListener("click", () => {
  let dataOutput = {}
  let timeValue = 0

  if (!timeInput.value) {
    ui.errorMessageContainer.textContent = "Time not provided..."
    setTimeout(() => {
      ui.errorMessageContainer.textContent = "";
    }, 5000);
  } else {
    timeValue = timeInput.value;
  };

  if (state.customDrink) {
    let customDrinkNameValid = checkInputText(customDrinkName.value, " drink");
    let customDrinkCaffeineValid = checkInputNumber(customDrinkCaffeine.value, " caffeine");
    if (customDrinkNameValid && customDrinkCaffeineValid && timeValue) {
      let customDrinkValue = customDrinkName.value;
      let customDrinkCaffeineValue = customDrinkCaffeine.value;
      dataOutput = {
        "Time": timeValue,
        "Drink": customDrinkValue,
        "Caffeine, mg": parseInt(customDrinkCaffeineValue)
      };
    } else if (!customDrinkNameValid && !customDrinkCaffeineValid) {
        ui.errorMessageContainer.textContent = "No custom drink info provided...";
        setTimeout(() => {
          ui.errorMessageContainer.textContent = "";
        }, 5000);
      };
  } else if (presetDrink && timeValue) {
    let presetDrinkValue = presetDrink.value;
    let presetDrinkCaffeineValue = state.presetDrinks[presetDrinkValue];
    dataOutput = {
      "Time": timeValue,
      "Drink": presetDrinkValue,
      "Caffeine, mg": presetDrinkCaffeineValue
    };
  };

  if (Object.keys(dataOutput).length > 0) {
    state.data.push(dataOutput);
    renderDataTable(state.data, drinkTableContainer)
  };
  console.log("Data entry:", dataOutput)
  console.log("Aggregate data:", state.data)

  state.chartData = createXYArray(state.data, state.userData)

  caffeineChart.data.datasets[0].data = state.chartData.totalConcentration;
  caffeineChart.data.labels = state.chartData.timePoints;
  caffeineChart.update();
});

clearDataButton.addEventListener("click", () => {
  state.data = [];
  state.userData = {};
  const dataTable = document.getElementById("ValuesTable");
  tableWithDefaultValues(state.defaultTableValues, drinkTableContainer);

  state.chartData =[]
  caffeineChart.data.datasets[0].data = [];
  caffeineChart.data.labels = createXValueArray(0, 24, 24*60);
  caffeineChart.update();
});
