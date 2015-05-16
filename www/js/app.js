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
                mapTypeControl: false,
                streetViewControl: false
            };
            var styles = [
                {
                    "stylers": [
                        { "hue": "#00b2ff" },
                        { "saturation": -16 },
                        { "gamma": 1.18 },
                        { "visibility": "simplified" }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "labels",
                    "stylers": [
                        { "visibility": "off" }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [
                        { "visibility": "off" }
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
            
            var myRegion = user.get("region").map(function(geoPoint) {
               return new google.maps.LatLng(geoPoint.latitude, geoPoint.longitude);
            });
                        
            var polyOptions1 = {
                path: myRegion,
                strokeColor: "#00cc33",
                strokeOpacity: 1,
                strokeWeight: 3,
                fillColor: '#00cc33',
                fillOpacity: 0.35
            }
            
            var myRegionPolygon = new google.maps.Polygon(polyOptions1);
            myRegionPolygon.setMap($scope.map);
            
            window.doMarking = function() {
                var rad = function(x) {
                    return x * Math.PI / 180;
                };
                
                var getDistance = function(p1, p2) {
                    var R = 6378137; // Earth’s mean radius in meter
                    var dLat = rad(p2.lat() - p1.lat());
                    var dLong = rad(p2.lng() - p1.lng());
                    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
                    Math.sin(dLong / 2) * Math.sin(dLong / 2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    var d = R * c;
                    return d; // returns the distance in meter
                };
                
                var currentCenter = map.getCenter();
                var minDistance = Number.MAX_VALUE;
                var minIndex = 0;
                
                for (var i = 0; i < myRegion.length - 1; i++) {
                    var d1 = getDistance(currentCenter, myRegion[i]);
                    var d2 = getDistance(currentCenter, myRegion[i + 1]);
                    var d = d1 + d2;
                    
                    if (d < minDistance) {
                        minDistance = d;
                        minIndex = i;
                    }
                }
                
                myRegion.splice(minIndex + 1, 0, currentCenter);
                
                myRegionPolygon.setMap(null);
                myRegionPolygon = new google.maps.Polygon(polyOptions1);
                myRegionPolygon.setMap($scope.map);
            };
            
            var query2 = new Parse.Query(User);
            query2.equalTo("username", "user2");
            query2.first({
                success: function(user) {
                    var friendRegion = user.get("region").map(function(geoPoint) {
                       return new google.maps.LatLng(geoPoint.latitude, geoPoint.longitude);
                    });
                    
                    var polyOptions2 = {
                        path: friendRegion,
                        strokeColor: "#0099ff",
                        strokeOpacity: 1,
                        strokeWeight: 3,
                        fillColor: '#0099ff',
                        fillOpacity: 0.35
                    }
                    
                    var it = new google.maps.Polygon(polyOptions2);
                    it.setMap($scope.map);
                    
                    google.maps.event.addListener(it, 'click', function (event) {
                        navi.pushPage('profile.html');
                    });
                },
                error: function() {
                    console.log(error)
                }
            });

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

