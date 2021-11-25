$(document).ready(() => {
  const settings = {
    async: true,
    // dataType: "json",
    crossDomain: true,
    url: "https://community-open-weather-map.p.rapidapi.com/weather?q=Helsinki%2Cfi&lat=0&lon=0&callback=test&id=2172797&lang=null&units=imperial&mode=xml",
    method: "GET",
    headers: {
      "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
      "x-rapidapi-key": "8c3dc06293msh94e84c30ec66810p1d8bb8jsn7852d910f2a0",
    },
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
  });
});
