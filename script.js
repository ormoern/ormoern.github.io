// global state values
const state = {
  data: [],
  inputFields: [
    "bodyMassBox",
    "metabolismSpeedSelect"
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
    "Black tea (300ml): 60,
    "Green tea (300ml): 40,
    "Energy drink (250ml)": 75,
    "Energy drink (500ml)": 150
  },
  metabolismSpeed: {
    "High": 3.5,
    "Medium": 5.7,
    "Low": 7.5
  }
};

function createSelectOptions(valueObject, selectElement) {
  const objectKeys = valueObject.keys
  objectKeys.foreach((item, index) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    selectElement.append(option);
  });
  
function createDashboard() {
  const inputContainer = document.getElementById("inputContainer");
  const dataContainer = document.getElementById("dataContainer");
  const presetDrinkContainer = document.createElement("div");
  const customDrinkContainer = document.createElement("div");
  const userInfoContainer = document.createElement("div");
  const buttonsContainer = document.createElement("div");
  
  presetDrinkContainer.classList.add("inputSubContainer");
  customDrinkContainer.classList.add("inputSubContainer");
  userInfoContainer.classList.add("inputSubContainer");
  buttonsContainer.classList.add("inputSubContainer");

  inputContainer.append(presetDrinkContainer, customDrinkContainer, userInfoContainer, buttonsContainer);
  
  const timeInputBox = document.createElement("input");
  timeInputBox.type = "time";
  timeInputBox.required = true;
  
  const presetDrinkSelect = document.createElement("select");
  createSelectOptions(state.presetDrinks, presetDrinksSelect);

  presetDrinkContainer.append(timeInputBox, presetDrinkSelect);

  const customDrinkNameBox = document.createElement("input");
  customDrinkNameBox.type = "text";
  customDrinkNameBox.name = "Drink name:";
  customDrinkNameBox.placeholder = "Coffee";
  
  const customDrinkCaffeineBox = document.createElement("input");
  customDrinkCaffeineBox.type = "text";
  customDrinkCaffeineBox.name = "Caffeine amount, mg:";
  customDrinkCaffeineBox.placeholder = "100";
  
  const customDrinkCheckBox = document.createElement("input");
  customDrinkCheckBox.type = "checkbox";
  customDrinkCheckBox.name = "Custom drink";
  customDrinkCheckBox.value = "customDrink";

  customDrinkContainer.append(customDrinkCheckBox, customDrinkNameBox, customDrinkCaffeineBox);

  const bodyMassBox = document.createElement("input");
  customDrinkCaffeineBox.type = "text";
  customDrinkCaffeineBox.name = "Body mass, kg:";
  customDrinkCaffeineBox.placeholder = "70";
  const metabolismSpeedSelect = document.createElement("select");
  createSelectOptions(state.metabolismSpeed, metabolismSpeedSelect);

  userInfoContainer.append(bodyMassBox, metabolismSpeedSelect);

  const addDataButton = document.createElement("input");
  addDataButton.type = "button";
  addDataButton.value = "Add entry";
  const clearDataButton = document.createElement("input");
  clearDataButton.type = "button";
  clearDataButton.value = "Clear all";
  const showGraphButton = document.createElement("input");
  showGraphButton.type = "button";
  showGraphButton.value = "Show graph";
}
  
