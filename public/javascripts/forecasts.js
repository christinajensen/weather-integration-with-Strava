$(document).ready(function() {
  var map;
  var myLatLng;
  var segments;
  var iconCode;
  var weatherIcon;
  var styles;
  var marker;

  // Ajax call to Strava API
  $.ajax({
    method: "GET",
    url: "https://www.strava.com/api/v3/routes/5775778?access_token=758e69afaa0c7dd7395146ca02b1dc51d3c24880", 
    dataType: 'jsonp'
  })
  .done(function(data) {
    // add google map
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.7749295, lng: -122.4194155},
        zoom: 10
      });

      // change map color+style
      styles = [{
        "featureType": "all",
        "elementType": "all",
        "stylers": [{
          "saturation": -100
        },
        {
          "gamma": 0.5
        }]
      }];
      map.setOptions({styles: styles});
    }
    initMap();

    // add marker as a weather icon
    segments = data.segments;
    myLatLng = [];

    for (var i = 0; i < segments.length; i++) {
      if (i && i % 15 === 0) {
        myLatLng.push({lat: data.segments[i].end_latlng[0], lng: data.segments[i].end_latlng[1]});
      }
    }

    $.each(myLatLng, function(i, value) {
      // AJAX call to weather API
      $.ajax({
        method: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?lat=" + value.lat + "&lon=" + value.lng + "&weather=icon&APPID=12fa1a4d7a570fc0ffd5c2895988482a", 
        dataType: 'jsonp'
      })
      .done(function(data) {
        iconCode = data.weather[0].icon;
        createWeatherIcon(iconCode, value);
      })
      .fail(function(err){
        console.log("FAIL", err)
      }); 

    function createWeatherIcon(iconCode, value) {
      weatherIcon = "http://openweathermap.org/img/w/" + iconCode + ".png";
      marker = new google.maps.Marker({
        position: {lat: value.lat, lng: value.lng},
        map: map,
        icon: weatherIcon
      }); 
    }

    });
  

  })
  .fail(function(err){
    console.log("FAIL", err)
  });


});