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

  // sortBy implementation for use later to sort segments array
  Array.prototype.sortBy = function (prop) {
    return this.slice(0).sort(function (a,b) {
      return (a[prop] > b[prop]) ? 1 : (a[prop] < b[prop]) ? -1 : 0;
    });
  }

  // Ajax call to Strava routes API
  $.ajax({
    method: "GET",
    // refactor route_id to not be hard coded
    url: "https://www.strava.com/api/v3/routes/5775019?access_token=758e69afaa0c7dd7395146ca02b1dc51d3c24880", 
    dataType: 'jsonp'
  })
  .done(function(data) {
    polylineData = data.map.summary_polyline;

    // add google map
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        // refactor to dynamicly setting center and zoom value based on route
        center: {lat: 37.7749295, lng: -122.4194155},
        zoom: 12
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

      // create polyline
      encodedPoly = google.maps.geometry.encoding.decodePath(polylineData);
      poly = new google.maps.Polyline({
            path: encodedPoly,
            geodesic: true,
            strokeColor: '#FF0000',
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
        segmentsArr.push({lat: segments[i].start_latlng[0], lng: segments[i].start_latlng[1]});
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