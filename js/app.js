var app = ons.bootstrap("inungress", ["onsen"]);

app.controller("MapCtrl", function($scope, $timeout){
    $scope.map;

    //Map initialization  
    $timeout(function(){

        var latlng = new google.maps.LatLng(35.7042995, 139.7597564);
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
        
        $scope.map = new google.maps.Map(document.getElementById("map-canvas"), options); 
        var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});
    
        $scope.map.mapTypes.set("map-style", styledMap);
        $scope.map.setMapTypeId("map-style");
        
        $scope.overlay = new google.maps.OverlayView();
        $scope.overlay.draw = function() {}; // empty function required
        $scope.overlay.setMap($scope.map);
        $scope.element = document.getElementById("map-canvas");
        $scope.hammertime = Hammer($scope.element).on("hold", function(event) {
            $scope.addOnClick(event);
        });

    },100);
});
