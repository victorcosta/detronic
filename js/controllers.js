angular.module('detran.controllers', [])

.controller('AppCtrl', ['$scope', '$localStorage','PushService', function($scope, $localStorage, PushService) {
    $scope.mycars = $localStorage.carros;
    
    setTimeout(function(){ 
        PushService.registerDevice(); 
    },5000);

    // setTimeout(function(){ 
    //     DataRequestService.createAccount(PushService.regid);
    // }, 7000);
}])



.controller('VeiculoCtrl', ['$scope','$window', '$localStorage', '$ionicLoading', function($scope, $window ,$localStorage, $ionicLoading) {

    $scope.show = function() {
        $ionicLoading.show({
          template: 'Carregando...'
        });
    };
    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $scope.consultar = function (form) {
        if (form.$valid){
            $window.location.href = '#/app/detalhes/'+form.placa.$viewValue+'/'+form.renavam.$viewValue+'/'+form.save.$viewValue;
        }
    }

    $scope.deletar = function (carro) {
        var storage = $localStorage.carros || [];
        storage.pop(carro);
        $localStorage.carros = storage;
        $scope.mycars = $localStorage.carros;            
    }

    $scope.$watch(function () { return $scope.mycars; },function(newVal,oldVal){
        $scope.mycars = $localStorage.carros;
    })
 
}])




.controller('DetalheCtrl', ['$scope','$localStorage', '$ionicLoading', '$stateParams', '$ionicPopup', '$ionicHistory', 'VeicleService', 
                                function($scope, $localStorage, $ionicLoading, $stateParams, $ionicPopup, $ionicHistory, VeicleService){
    $scope.show = function() {
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-energized" icon="android"></ion-spinner>'
        });
    };
    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Desculpe',
            template: 'Houve um erro no servidor',
            buttons: [{
                text: 'Ok',
                type: 'button-dark',
                    
            }]
        });
        alertPopup.then(function(res) {
            $ionicHistory.goBack(-1);
        });
    };

    $scope.form = {
        placa:$stateParams.placa,
        renavam:$stateParams.renavam,
        save:$stateParams.save,
    }

    $scope.show();
    VeicleService.getData($scope.form).success(function(data){
        $scope.veicleinfo = data;
        if ($scope.form.save) {
            var carro   = {placa: $scope.form.placa, renavam: $scope.form.renavam, marca: data.Marca, ano:data.Ano};
            var storage = $localStorage.carros || [];
            storage.push(carro);
            $localStorage.carros = storage;
            $scope.mycars = $localStorage.carros;
        };
        $scope.hide();
        console.log($scope.veicleinfo);
    }).error(function(data){
        console.log(data);
        $scope.showAlert();
        $scope.hide();
    });     

    $scope.$watch(function () { return $scope.mycars; },function(newVal,oldVal){
        $scope.mycars = $localStorage.carros;
    })
    
}])





.controller('CartilhaCtrl', ['$scope','$window',function($scope, $window) {
    $scope.goTo = function(url){
        $window.open(url, '_system', 'location=yes');
    }
 
}])




.controller('ServicosCtrl', ['$scope', '$ionicLoading', '$ionicPopup', '$ionicHistory', 'ServicosServices',
                    function($scope, $ionicLoading, $ionicPopup, $ionicHistory, ServicosServices) {

    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Desculpe',
            template: 'Houve um erro no servidor',
            buttons: [{
                text: 'Ok',
                type: 'button-dark',
                    
            }]
        });
        alertPopup.then(function(res) {
            $ionicHistory.goBack(-1);
        });
    };

    $scope.show = function() {
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-energized" icon="android"></ion-spinner>'
        });
    };
    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $ionicLoading.show();


    ServicosServices.getData().success(function(data){
        $scope.services = data.servicos;
        $ionicLoading.hide();
    }).error(function(data){
        console.log(data);
        $scope.showAlert();
        $scope.hide();
    });

 
}])




.controller('ServicoCtrl', ['$scope', '$ionicLoading',  '$window', '$ionicPopup', '$ionicHistory', '$stateParams','ServicosServices', 'geoLocationService',
                    function($scope, $ionicLoading,  $window, $ionicPopup, $ionicHistory, $stateParams, ServicosServices, geoLocationService) {

    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Desculpe',
            template: 'Houve um erro no servidor',
            buttons: [{
                text: 'Ok',
                type: 'button-dark',
                    
            }]
        });
        alertPopup.then(function(res) {
            $ionicHistory.goBack(-1);
        });
    };

    $scope.show = function() {
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-energized" icon="android"></ion-spinner>'
        });
    };
    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $scope.getLink = function(lat,lng) {
        if (ionic.Platform.isAndroid()) {
            $window.location.href = "geo:"+lat+","+lng+"?q="+lat+","+lng;            
        } else if (ionic.Platform.isIOS()) {
            $window.location.href = "maps://maps.apple.com/?q="+lat+","+lng;
        }  
    };

    
    // onError Callback receives a PositionError object
    //
    function onError(error) {
        console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    var onSuccess = function (position) {

        $scope.$apply(function() {
            $scope.myLocation = [];

            detranscoord.forEach(function(index, el) {
                $scope.myLocation.push({
                    title : index.title,
                    distance : geoLocationService.calculateDistance(position.coords,index),
                    latitude: index.latitude,
                    longitude: index.longitude
                })
            });
            
        });
        $ionicLoading.hide();
    };


    $ionicLoading.show();


    var detranscoord = [];

    $scope.title = '';

    $ionicLoading.show();
    ServicosServices.getFiliais($stateParams.id).success(function(data){
        detranscoord = data.servico.Filiai;
        $scope.title = data.servico.Servico.servico;
        geoLocationService.getLocation(onSuccess,onError);
    }).error(function(data){
        console.log(data);
        $scope.showAlert();
        $scope.hide();
    });



}])



.controller('NotificacaoCtrl', ['$scope', '$localStorage',
                    function($scope, $localStorage) {

    $scope.notifications = $localStorage.notifications || [];


    // $scope.$watchCollection('notifications', function(newNames, oldNames) {
    //     $scope.notifications = $localStorage.notifications;
    // });


    $scope.deletar = function (notification) {
        var storage = $localStorage.notifications;
        storage.splice( storage.indexOf(notification), 1 );
        $localStorage.notifications = storage;
        $scope.notifications = $localStorage.notifications;            
    }
    
    // $scope.$apply();
    

}])



.controller('LocalizacaoCtrl', ['$scope', '$ionicLoading', '$window', '$ionicPopup', '$ionicHistory' ,'geoLocationService', 'FiliaisService',
                        function($scope, $ionicLoading, $window, $ionicPopup, $ionicHistory, geoLocationService, FiliaisService) {

    $scope.myLocation = [];

    var detranscoord = [];

    $ionicLoading.show();

    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Desculpe',
            template: 'Houve um erro no servidor',
            buttons: [{
                text: 'Ok',
                type: 'button-dark',
                    
            }]
        });
        alertPopup.then(function(res) {
            $ionicHistory.goBack(-1);
        });
    };

    $scope.show = function() {
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-energized" icon="android"></ion-spinner>'
        });
    };
    $scope.hide = function(){
        $ionicLoading.hide();
    };


    $scope.getLink = function(lat,lng) {
        if (ionic.Platform.isAndroid()) {
            $window.location.href = "geo:"+lat+","+lng+"?q="+lat+","+lng;            
        } else if (ionic.Platform.isIOS()) {
            $window.location.href = "maps://maps.apple.com/?q="+lat+","+lng;
        }  
    };
       
    // onError Callback receives a PositionError object
    //
    function onError(error) {
        console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    var onSuccess = function (position) {

        $scope.$apply(function() {
            $scope.myLocation = [];

            detranscoord.forEach(function(index, el) {
                $scope.myLocation.push({
                    title : index.Filiai.title,
                    distance : geoLocationService.calculateDistance(position.coords,index.Filiai),
                    latitude: index.Filiai.latitude,
                    longitude: index.Filiai.longitude
                })
            });
            
        });
        $ionicLoading.hide();
    };

    FiliaisService.getData().success(function(data){
        detranscoord = data.filiais;
        geoLocationService.getLocation(onSuccess,onError);       
    }).error(function(data){
        console.log(data);
        $scope.showAlert();
        $scope.hide();
    });

 
}]);

