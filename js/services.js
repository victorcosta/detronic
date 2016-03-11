angular.module('detran.services', [])
.factory('VeicleService', ['$http',function ($http) {
    return {
        getData: function (consulta) {
            return $http({
                url: "http://projetos.maxmeio.com/detran/server/consultaveiculo?renavam="+ consulta.renavam+ "&placa=" + consulta.placa+"&callback=JSON_CALLBACK",
                method: 'JSONP', 
                responseType: "json"
            });
        }
    }
}])
.factory('FiliaisService', ['$http',function ($http) {
    return {
        getData: function () {
            return $http({
                url: "http://projetos.maxmeio.com/detran/server/filiais.json?&callback=JSON_CALLBACK",
                method: 'JSONP', 
                responseType: "json"
            });
        }
    }
}])
.factory('ServicosServices', ['$http',function ($http) {
    return {
        getData: function () {
            return $http({
                url: "http://projetos.maxmeio.com/detran/server/servicos.json?&callback=JSON_CALLBACK",
                method: 'JSONP', 
                responseType: "json"
            });
        },
        getFiliais: function (id) {
            return $http({
                url: "http://projetos.maxmeio.com/detran/server/servicos/view/"+id+".json?&callback=JSON_CALLBACK",
                method: 'JSONP', 
                responseType: "json"
            });
        }
    }
}])
.factory('geoLocationService', function () {
	'use strict';

	function toRad(value) {
        var RADIANT_CONSTANT = 0.0174532925199433;
        return (value * RADIANT_CONSTANT);
    }

    return {
        getLocation: function (success, error) {
            navigator.geolocation.getCurrentPosition(success, error);
        },
        calculateDistance: function (starting, ending) {
        				
			var KM_RATIO = 6371;
        	try {      
            	var dLat = toRad(ending.latitude - starting.latitude);
            	var dLon = toRad(ending.longitude - starting.longitude);
            	var lat1Rad = toRad(starting.latitude);
            	var lat2Rad = toRad(ending.latitude);
        
            	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                	    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
            	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            	var d = KM_RATIO * c;
            
            	return d;
        	} catch(e) {
            	return -1;
        	}
  	  	}

    };


})
.factory('PushService', function ($window, $http, $rootScope, $location) {
    return {
        registerDevice: function () {
            var push = PushNotification.init({
                "android": {
                    "senderID": "316602374140",
                    "icon": "small_icon", 
                    "iconColor": "#2c2c2c"
                },
                "ios": {},
                "windows": {}
            });

            push.on('registration', function (data) {
                // data.registrationId
                // console.log(data);
                $http.get('http://projetos.maxmeio.com/detran/server/clientes/add/?key='+data.registrationId+'&os=1').success(function (data) {});
            });

            push.on('notification', function (data) {
                var notifications   = $window.localStorage['ngStorage-notifications'] || [];
                notifications       =  JSON.parse(notifications);
                notifications.push(data);
                $window.localStorage['ngStorage-notifications'] = JSON.stringify(notifications);
                $rootScope.$apply();
                $location.path("/app/notificacoes");

            });

            push.on('error', function (e) {
                // e.message
            });
        }
    }
})

.filter('distance', function () {
	return function (input) {
	    if (input >= 1) {
	        return (input).toFixed(1) + ' km';
	    } else {
	        return (input*1000).toFixed(1) + ' m';
	    }
	}
})
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})
;