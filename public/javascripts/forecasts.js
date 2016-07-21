$(document).ready(function() {
  var map;
  var segmentsArr;
  var sortedSegments;
  var segments;
  var iconCode;
  var weatherIcon;
  var styles;
  var marker;
  var polylineData;
  var poly;
  var encodedPoly;
  var infoWindow;
  var windSpeed;
  var humidity;
  var weatherDescription;

  // sortBy implementation for use later to sort segments array
  Array.prototype.sortBy = function (prop) {
    return this.slice(0).sort(function (a,b) {
      return (a[prop] > b[prop]) ? 1 : (a[prop] < b[prop]) ? -1 : 0;
    });
  }

  // create new instance of InfoWindow
  infoWindow = new google.maps.InfoWindow({
    map: map
  });

  // Ajax call to Strava routes API
  $.ajax({
    method: "GET",
    // refactor route_id to not be hard coded
    url: "https://www.strava.com/api/v3/routes/5775778?access_token=758e69afaa0c7dd7395146ca02b1dc51d3c24880", 
    dataType: 'jsonp'
  })
  .done(function(data) {
    polylineData = data.map.summary_polyline;

    // add google map
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        // refactor to dynamicly setting center and zoom value based on route
        center: {lat: 37.7749295, lng: -122.4194155},
        zoom: 13
      });

      // change map color+style
      styles = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]
      map.setOptions({styles: styles});

      // create polyline
      encodedPoly = google.maps.geometry.encoding.decodePath(polylineData);
      poly = new google.maps.Polyline({
            path: encodedPoly,
            geodesic: true,
            strokeColor: '#ff3300',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });

      poly.setMap(map);
    }
    initMap();

    // add weather icon marker to map
    segments = data.segments;
    segmentsArr = [];

    for (var i = 0; i < segments.length; i++) {
      // refactor if statement to not be hard coded, but instead be first, middle and last lat?
      if (i && i % 3 === 0) { 
        segmentsArr.push({lat: segments[i].end_latlng[0], lng: segments[i].end_latlng[1]});
      }
    }
    // sort segments array
    sortedSegments = segmentsArr.sortBy('lat');
    
    // AJAX call to weather API
    $.each(sortedSegments, function(i, value) {
      $.ajax({
        method: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?lat=" + value.lat + "&lon=" + value.lng + "&weather=icon&APPID=12fa1a4d7a570fc0ffd5c2895988482a", 
        dataType: 'jsonp'
      })
      .done(function(data) {
        weatherDescription = data.weather[0].description;
        humidity = data.main.humidity;
        windSpeed = data.wind.speed;
        iconCode = data.weather[0].icon;
        createWeatherIcon(iconCode, value, windSpeed, weatherDescription, humidity);
      })
      .fail(function(err){
        console.log("FAIL", err)
      }); 

      function createWeatherIcon(iconCode, value, windSpeed, weatherDescription, humidity) {
        weatherIcon = "http://openweathermap.org/img/w/" + iconCode + ".png";
        marker = new google.maps.Marker({
          position: {lat: value.lat, lng: value.lng},
          map: map,
          icon: weatherIcon
        }); 

        // show infowindow on mouse-over weathericon
        marker.addListener('mouseover', function() {
          infoWindow.open(map, this);
          infoWindow.setContent('<div id="iw-container">' + 
            '<div class="iw-title">' + 'Real Time Weather Info' + '</div>' + 
            '<div class="iw-content">' + 'Description: ' + weatherDescription + '<br>' + 
            'Wind Speed: ' + windSpeed + '<br>' + 
            'Humidity: ' + humidity + '</div>' + 
            '</div>');
        });
        // hide infowindow on mouses-out
        marker.addListener('mouseout', function() {
          infoWindow.close();
        });
      }
    });
  })
  .fail(function(err){
    console.log("FAIL", err)
  });

});