//Api Key
const apiKey = "GCCoWqJGg8yChV9h2rCMd6pWOa6i9TtK";
// element query selectors
const form = document.querySelector("form");
const inputSearch = document.getElementById("inputSearch");
const main = document.querySelector("main");
const imgUpdate = document.getElementById("imgUpdate");
const tempImage = document.getElementById("tempImage");
// const h2 = document.querySelector("h2");
// Current Condition Async Method
const cityCondition = async (id) => {
  //Variables to hold value of base url and query parameter
  const baseURL = "https://dataservice.accuweather.com/currentconditions/v1/";
  const cityConditionKey = `${id}?apikey=${apiKey}`;
  //   Fetching url and returning promises
  const response = await fetch(baseURL + cityConditionKey);
  const data = await response.json();
  return data[0];
};

// City Search Async Method
const citySearch = async (city) => {
  //Variables to hold value of base url and query parameter
  const baseURL =
    "https://dataservice.accuweather.com/locations/v1/cities/search";
  const cityQueryKey = `?apikey=${apiKey}&q=${city}`;
  // fetching url and returning promises
  const response = await fetch(baseURL + cityQueryKey);
  const data = await response.json();
  return data[0];
};
//Function to repeat updating data for elements
const updateFields = (element, dataFormat) => {
  document.querySelector(element).innerHTML = dataFormat;
};
//Function that takes input value as a parameter and then promises are chained onto
const pullData = (searchkey) => {
  citySearch(searchkey)
    .then((data) => {
      updateFields(".weather-details h2", data.EnglishName);
      return cityCondition(data.Key);
    })
    .then((res) => {
      updateFields(".weather-details h3", res.WeatherText);
      if (res.IsDayTime) {
        imgUpdate.setAttribute("src", "images/day.png");
      } else {
        imgUpdate.setAttribute("src", "images/night.png");
      }
      updateFields("[data-temp-current]", res.Temperature.Metric.Value);
      updateFields("[data-temp-c]", "C");
      if (res.Temperature.Metric.Value > 35) {
        tempImage.setAttribute("src", "images/hot.png");
      } else {
        tempImage.setAttribute("src", "images/cold.png");
      }
    })
    .catch(() => {
      console.log("error");
    });
};
//Submit even listener for form to use the function that promise
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let searchInput = inputSearch.value.trim();
  form.reset();
  pullData(searchInput);
  if (main.classList.contains("dp-none")) {
    main.classList.remove("dp-none");
    main.classList.add("dp-opa");
  }
});
