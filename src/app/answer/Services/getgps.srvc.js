(function () {
    'use strict';

    angular
        .module('app')
        .service('getgps', getgps);

    getgps.$inject = ['$rootScope', '$http', 'APP_API_KEY', 'GOOGLE_API_KEY'];

    function getgps($rootScope, $http, APP_API_KEY, GOOGLE_API_KEY) {

        var service = {

            getLocationGPS: getLocationGPS
        };

        return service;

        function getLocationGPS(answer) {

            delete $http.defaults.headers.common['X-Dreamfactory-API-Key'];
            var myLoc = '';
                if (answer.location.includes('San Diego') == false) {
                    myLoc = answer.location + ' San Diego, CA';
                }
                else myLoc = answer.location;
                console.log("myLoc, GOOGLE_API_KEY --- ", myLoc, GOOGLE_API_KEY);
                var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + myLoc + '&key=' + GOOGLE_API_KEY;
                console.log("url --- ", url);
                return $http.get(url, {}, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                        //'Access-Control-Allow-Headers': 'x-dreamfactory-api-key'
                    }
                }).then(function (result) {
                    //console.log("google response:---", result);
                    answer.location = result.data.results[0].formatted_address;
                    answer.lat = result.data.results[0].geometry.location.lat;
                    answer.lng = result.data.results[0].geometry.location.lng;

                    $http.defaults.headers.common['X-Dreamfactory-API-Key'] = APP_API_KEY;
                    $rootScope.$emit('answerGPSready');
                    //answer.updateAnswer(cAnswer.id,['lat','lng','location'],[lat,lng,fa]);
                });

            
        }
    }


})();