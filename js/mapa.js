// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infoWindow;
//var directionsService = new google.maps.DirectionsService();
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -32.0281818, lng: -52.1013609},
        zoom: 15
    });

    infoWindow = new google.maps.InfoWindow({
        map:map,
        maxWidth:200
    });

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
        var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        map.setCenter(pos);
        infoWindow = new google.maps.InfoWindow({
        maxWidth: 200
        });

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: pos,
            radius: 50000,
            type: ['movie_theater']
        }, callback);
        var vetor = [];
        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                    vetor.push("<b>"+"Nome: "+"<b>"+results[i].name+"<br>"+"<b>"+"Endereço: "+"<b>"+results[i].vicinity+"<br>"+"<br>");
                    console.log(vetor);
                }
            }
        }
        function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(place.name);
        service.getDetails(place, function (details, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  infoWindow.setContent(place.name + '<br> <button type="button" id="salvar">Salvar Endereço</button>');
                  console.log(details.formatted_address);
                  var buttonSalvar = document.querySelector("#salvar");
                  buttonSalvar.addEventListener('click', function (params) {
                    if (localStorage.getItem('cinemas') != null) {
                      if (localStorage.getItem('cinemas').indexOf(details.name) === -1) {
                        Persistencia.adiciona(
                          'cinemas', {
                            nome: details.name,
                            endereco: details.formatted_address
                          });
                      }
                    
                    } else {
                      Persistencia.adiciona(
                        'cinemas', {
                          nome: details.name,
                          endereco: details.formatted_address
                        });
                      localStorage.setItem('nome', details.name);

                    }
                    infoWindow.close();
                });
                }
        });
        infoWindow.open(map, this);
    });
}

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        }, {
            enableHighAccuracy: true,
            maximumAge: 20000,
            timeout: 20000
        });
    } else {
    // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}
