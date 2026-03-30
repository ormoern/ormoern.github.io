// --- GLOBAL STATE VALUES ---

const state = {
  data: [],
  errorMessages: {
    "Empty, caffeine" : "",
    "Empty, weight": "",
    "Empty, drink": "",
    "Symbols, weight": "",
    "Undefined": "Undefined error"
  },
  userData: {
    "BodyMass": 0,
    "metabolismSpeedDisplay": "",
    "metabolismSpeed": 0
  },
  customDrink: False,
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
  }
};

const ui = renderUI();
// --- HELPER FUNCTIONS ---

// create option values for select input type
const createSelectOptions = (valueObject, selectElement) => {
  const objectKeys = valueObject.keys
  objectKeys.foreach((item, index) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    selectElement.append(option);
  });
};

// --- UI RENDERING ---

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

  // assign classes to data data value subcontainers
  actualDataContainer.classList.add("dataSubSubContainer")
  drinkTableContainer.classList.add("dataSubSubContainer")

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
    showGraphButton
 }
};

// --- ERROR HANDLING ---

const checkInputText = (textInput, inputType) => {
  const regex = /[^A-Za-z0-9]/; //used to check for special characters, optional
  let errorMessage = "";
  let inputValid = False;

  if (textInput.length === 0 || textInput === null) {
    errorType = "Empty," + inputType;
    errorMessage = state.data.errorMessages[errorType];
    ui.errorMessageContainer.textContent = errorMessage;

    inputValid = False;
    return inputValid
  } else {
    inputValid = True
    return inputValid
  };
};

const checkInputNumber = (numberInput, inputType) => {
  const regex = /[^0-9]/; //used to check for special characters or letters
  let errorMessage = "";
  let inputValid = False;

  if (numberInput.length === 0 || textInput === null) {
    errorType = "Empty," + inputType;
    errorMessage = state.data.errorMessages[errorType];
    ui.errorMessageContainer.textContent = errorMessage;

    inputValid = False;
    return inputValid
  } else if (regex.test(numberInput)) {
    errorType = "Symbols," + inputType;
    errorMessage = state.data.errorMessages[errorType];
    ui.errorMessageContainer.textContent = errorMessage;

    inputValid = False;
    return inputValid
  } else {
    inputValid = True;
    return inputValid
  };
};

// --- DATA PARSING ---

const timeToDecInt = (timeInput) => {
  hoursInt = parseInt(timeInput(0, 2));
  minutesInt = parseInt(timeInput(-2));
  timeDec = ((math.round((hoursInt + (minutesInt / 60)) * 100)) / 100)
  return timeDec
};


// --- USER ACTIONS ---
// access input fields
const bodyMass = ui.bodyMass;
const metabolismSpeed = ui.metabolismSpeed;
const inputTime = ui.inputTime;
const customDrink = data.customDrink;
const customDrinkName = ui.customDrinkName;
const customDrinkCaffeine = ui.customDrinkCaffeine;
const presetDrink = ui.presetDrink;

// checkbox action
const customDrinkCheckBox = ui.customDrinkCheckBox;
customDrinkCheckBox.addEventListener("change", () => {
  if (customDrinkCheckBox.checked) {
    data.customDrink = True;
  } else {
    data.customDrink = False;
  };
});

// --- button actions ---
// access buttons
const addDataButton = ui.addDataButton;
const clearDataButton = ui.clearDataButton;
const showGraphButton = ui.showGraphButton;
const userInfoSaveButton = ui.userInfoSaveButton;

const undefinedError = "Undefined error..."
let errorMessage = ""

userInfoSaveButton.addEventListener("click", () => {
  let bodyMassValue = bodyMass.value;
  let metabolismSpeedValue = metabolismSpeed.value;
  let bodyMassInputValid = checkInputNumber(bodyMassValue);

  if (bodyMassInputValid) {
    state.userData.bodyMass = bodyMassValue;
  } else {
    state.userData.bodyMass = 0;
  };

  state.userData.metabolismSpeedDisplay = metabolismSpeedValue;
  state.userData.metabolismSpeed = data.metabolismSpeed[metabolismSpeedValue];

  return
});

addDataButton.addEventListener("click", () => {
  let dataOutput = {}
  if (inputTime.value != "" || inputTime.value != null) {
    let timeValue = timeToDecInt(inputTime.value);
  } else if (inputTime.value === "" || inputTime.value === null)  {
    ui.errorMessageContainer.textContent = "Time not provided."
  };

  if (state.customDrink) {
    let customDrinkNameValid = checkInputText(customDrinkName.value);
    let customDrinkCaffeineValid = checkInputNumber(customDrinkCaffeine.value);
    if (customDrinkNameValid && customDrinkCaffeineValid) {
      let customDrinkValue = customDrinkName.value;
      let customDrinkCaffeineValue = customDrinkCaffeine.value;
      dataOutput = {
        timeValue,
        customDrinkValue,
        customDrinkCaffeineValue
      }
    };
  } else {
    let presetDrinkValue = presetDrink.value;
    let presetDrinkCaffeineValue = state.presetDrinks(presetDrink);
    dataOutput = {
      timeValue,
      presetDrinkValue,
      presetDrinkCaffeineValue
    };
  };
  
  return
});

