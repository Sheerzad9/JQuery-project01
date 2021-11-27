$(document).ready(() => {
  // Below is the API which returns data of the current incidents of the country
  function fetchCovidHistory(country_name) {
    fetch(`https://covid-19-data.p.rapidapi.com/country?name=${country_name}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
        "x-rapidapi-key": "8c3dc06293msh94e84c30ec66810p1d8bb8jsn7852d910f2a0",
      },
    })
      .then((response) => {
        data = response.json();
        return data;
      })
      .then((data) => {
        renderCovidHistory(data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  //////////////////////////////////////////////////////////////////////
  // API which returns data of safety travel rate of searched country
  function fetchTravelStatus(country_name) {
    fetch(`https://eu-covid-19-travel.p.rapidapi.com/travel/${country_name}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "eu-covid-19-travel.p.rapidapi.com",
        "x-rapidapi-key": "8c3dc06293msh94e84c30ec66810p1d8bb8jsn7852d910f2a0",
      },
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data[0]);
        renderTravelStatus(data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  // Render travel status
  function renderTravelStatus(data) {
    html = `
      <h3 style='text-align: center;'>Travel Status&emsp;<span class='dot' style='background-color: ${
        data.colour
      };'></span></h3><br>
      <h5 style='font-weight: bold;'>Status: ${data.travel_status}</h5><br>
      <h5 style='font-weight: bold;'>Posivity rate (out of all tested): ${data.national_positivity_rate.toFixed(
        2
      )}%</h5><br><br>`;

    $(html).hide().appendTo(".situation").fadeIn(3000);
    $(".situation").addClass("black-borders");
  }

  // Render corona history
  function renderCovidHistory(data) {
    html = `
      <h3 style='text-align: center;'>Covid-19 Stats</h3><br>
      <h5 style='font-weight: bold;'>Confirmed cases: ${
        data.confirmed > 1000000
          ? (data.confirmed / 1000000).toFixed(1) + " million"
          : (data.confirmed / 100000).toFixed(1) + " hundred thousand"
      }</h5><br>
      <h5 style='font-weight: bold;'>Recovery cases: ${
        data.recovered > 1000000
          ? (data.recovered / 1000000).toFixed(1) + " million"
          : (data.recovered / 100000).toFixed(1) + " hundred thousand"
      }</h5><br>
      <h5 style='font-weight: bold;'>Death cases: ${data.deaths}</h5><br><br>`;
    $(html).hide().appendTo(".ratios").fadeIn(3000);
    $(".ratios").addClass("black-borders");
  }
  //Clear previously shown data
  function clearPage() {
    if ($(".country__img") !== undefined) {
      $(".nation-flag").empty();
      $(".ratios").removeClass("black-borders").empty();
      $(".situation").removeClass("black-borders").empty();
    }
  }

  //Updating the "recently searched" list
  function updateList() {
    html = `<li>${$(".search-input").val()}</li>`;
    $(html).appendTo(".list");
  }

  // Adding country flag
  function renderNationFlag(data) {
    html = `<img class="country__img" src="${data.flags.png}" /><br><br><h2>${data.name.common}</h2>`;
    $(html).hide().appendTo(".nation-flag").fadeIn(2000);
  }

  // this function fetches from our first API, after that we call two other API's
  function fetchData() {
    fetch(
      `https://restcountries.com/v3.1/name/${$(
        ".search-input"
      ).val()}?fullText=true`
    )
      .then((res) => {
        data = res.json();
        return data;
      })
      .then((data) => {
        console.log(data[0]);
        renderNationFlag(data[0]);
        const correctInput =
          $(".search-input").val().charAt(0).toUpperCase() +
          $(".search-input").val().substring(1);
        fetchCovidHistory($(".search-input").val());
        fetchTravelStatus(correctInput);
      });
  }

  $("button").click(() => {
    clearPage();
    updateList();
    fetchData();
  });

  $("#flip").click(() => {
    $("#recent-search-list").slideToggle("slow");
  });
});
