$(document).ready(function() {
  var map;
  var myLatLng;

  $.ajax({
    method: "GET",
    url: "https://www.strava.com/api/v3/routes/5775019?access_token=758e69afaa0c7dd7395146ca02b1dc51d3c24880", 
    dataType: 'jsonp'
  })
  .done(function(data) {
    myLatLng = {};
    console.log(data.segments);
    myLatLng['lat'] = data.segments[30].end_latlng[0];
    myLatLng['lng'] = data.segments[30].end_latlng[1];

    // add google map to '/forecasts'
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 12
      });

      // change map color+style
      var styles = [{
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

    // change marker color
    var pinColor = "FFA500";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));

    // add marker
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: pinImage
    });

  })
  .fail(function(err){
    console.log("FAIL")
    console.log(err)
  });



  // add marker on click
  // var mapDiv = document.getElementById('map');
  // google.maps.event.addListener(map, 'click', addMarker);

  // function addMarker(event) {
    // var lat = event.latLng.lat();
    // var lng = event.latLng.lng();
  // }
  

});