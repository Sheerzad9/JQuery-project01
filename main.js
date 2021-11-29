$(document).ready(() => {
  // Below is the API which returns data of the current covid -19 incidents of the country
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
        return response.json();
      })
      .then((data) => {
        renderTravelStatus(data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  // Render travel status
  function renderTravelStatus(data) {
    if (typeof data == "undefined") {
      html = `<h3 style='text-align: center'>Search EU-country for travel status</h3>`;
      $(html).hide().appendTo(".situation").fadeIn(3000);
      $(".situation").addClass("black-borders");
    } else {
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
  }

  // Render corona history
  function renderCovidHistory(data) {
    html = `
      <h3 style='text-align: center;'>Covid-19 Stats</h3><br>
      <h5 style='font-weight: bold;'>Registered confirmed cases: ${
        data.confirmed > 1000000
          ? (data.confirmed / 1000000).toFixed(2) + " million"
          : (data.confirmed / 100000).toFixed(1) + " hundred thousand"
      }</h5><br>
      <h5 style='font-weight: bold;'>Registered recovery cases: ${
        data.recovered > 1000000
          ? (data.recovered / 1000000).toFixed(2) + " million"
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
    html = `<img class="country__img" src="${data.flags.png}" /><br><br><h2 style='font-weight: bold;'>${data.name.common}</h2>`;
    $(html).hide().appendTo(".nation-flag").fadeIn(2000);
  }

  // this function fetches from our first API (Rest countries), after that we call two other API's, basically this function also checks the input, because if the first fetch response status is not ok (meaning user didn't spell the country correctly), we throw error and go to catch method directly
  function fetchData() {
    fetch(
      `https://restcountries.com/v3.1/name/${$(
        ".search-input"
      ).val()}?fullText=true`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `The country you searched "${$(
              ".search-input"
            ).val()}" doesn't exist ☹ , please try again`
          );
        }
        data = res.json();
        return data;
      })
      .then((data) => {
        if ($(".main-content").css("display") == "none") {
          $(".main-content").css("display", "block").hide().fadeIn();
        }
        renderNationFlag(data[0]);
        const correctInput =
          $(".search-input").val().charAt(0).toUpperCase() +
          $(".search-input").val().substring(1);
        fetchCovidHistory($(".search-input").val());
        fetchTravelStatus(correctInput);
      })
      .catch((error) => {
        alert(error);
      });
  }
  //Waiting for user to click
  $("button").click(() => {
    clearPage();
    updateList();
    fetchData();
  });
  // Waiting for user click here also :-)
  $("#flip").click(() => {
    $("#recent-search-list").slideToggle("slow");
  });
});
