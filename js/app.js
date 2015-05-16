Parse.initialize("wf8hSrb3nvwMs4Wzmc8eoIQc71YueLTCOGhw3CNa", "bf0N2sbFI5gXulyh1NRh7p9GnBkkOJ2yIx8jgGWM");
var app = ons.bootstrap("inungress", ["onsen"]);

app.controller("MapCtrl", function($scope, $interval){
    $scope.map;

    var User = Parse.Object.extend("User");

    var query = new Parse.Query(User);
    query.equalTo("username", "user1");
    query.first({
        success: function(user) {
            var currentLocation = user.get("currentLocation");
            var latlng = new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
            var options = {
                zoom: 16,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            };
            var styles = [
                {
                    "stylers": [
                        { "hue": "#00b2ff" },
                        { "saturation": -16 },
                        { "gamma": 1.18 },
                        { "visibility": "simplified" }
                    ]
                }
            ];
            
            var map = new google.maps.Map(document.getElementById("map-canvas"), options); 
            var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});
            
            $scope.map = map;
            $scope.map.mapTypes.set("map-style", styledMap);
            $scope.map.setMapTypeId("map-style");

            var markerCenter = new google.maps.Marker({
                position: latlng,
                map: map,
                draggable: false
            });
            
            google.maps.event.addListener(map, 'center_changed', function(){
                var pos = map.getCenter();
                markerCenter.setPosition(pos);
            });
            
            var myCoordinates1 = [
                new google.maps.LatLng(34.650791,135.495737),
                new google.maps.LatLng(34.649732,135.499921),
                new google.maps.LatLng(34.646095,135.498955),
                new google.maps.LatLng(34.645107,135.497561),
                new google.maps.LatLng(34.645177,135.495179),
                new google.maps.LatLng(34.650791,135.495737)
            ];
            
            var polyOptions1 = {
                path: myCoordinates1,
                strokeColor: "#00cc33",
                strokeOpacity: 1,
                strokeWeight: 3,
                fillColor: '#00cc33',
                fillOpacity: 0.35
            }
            
            var myCoordinates2 = [
                new google.maps.LatLng(34.651550,135.503054),
                new google.maps.LatLng(34.650526,135.500200),
                new google.maps.LatLng(34.649326,135.498998),
                new google.maps.LatLng(34.647278,135.500758),
                new google.maps.LatLng(34.646837,135.502968),
                new google.maps.LatLng(34.651550,135.503054),
            ];
            var polyOptions2 = {
                path: myCoordinates2,
                strokeColor: "#0099ff",
                strokeOpacity: 1,
                strokeWeight: 3,
                fillColor: '#0099ff',
                fillOpacity: 0.35
            }
            
            var it = new google.maps.Polygon(polyOptions1);
            it.setMap($scope.map);
            
            var it = new google.maps.Polygon(polyOptions2);
            it.setMap($scope.map);
            
            var pollCurrentLocation  = $interval(function() {
                user.fetch();
                var currentLocation = user.get("currentLocation");
                var latlng = new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
                map.panTo(latlng);
            }, 1000);
        },
        error: function(error) {
            console.log(error);
        }
    });
});
