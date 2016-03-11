document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('deviceready', function () {
        angular.bootstrap(document.body, ['detran']);
    }, false);
});


angular.module('detran', ['ionic', 'detran.controllers', 'detran.services','ngStorage','angular.filter','ngTouch'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
         

    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.transition('none');
    $ionicConfigProvider.platform.android.views.maxCache(0);
    $ionicConfigProvider.platform.ios.views.maxCache(0);
    $ionicConfigProvider.backButton.text('');
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.index', {
        url: '/index',
        views: {
            'menuContent': {
                templateUrl: 'templates/index.html'
            }
        }
    })

    .state('app.consultaveiculo', {
        url: '/consultaveiculo',
        views: {
            'menuContent': {
                templateUrl: 'templates/consultaveiculo.html',
                controller: 'VeiculoCtrl'
            }
        }
    })

    .state('app.meuscarros', {
        url: '/meuscarros',
        views: {
            'menuContent': {
                templateUrl: 'templates/meuscarros.html',
                controller: 'VeiculoCtrl'
            }
        }
    })

    .state('app.detalhes', {
        url: '/detalhes/:placa/:renavam/:save',
        views: {
            'menuContent': {
                templateUrl: 'templates/detalhes.html',
                controller: 'DetalheCtrl'
            }
        }
    })

    .state('app.servicos', {
        url: '/servicos',
        views: {
            'menuContent': {
                templateUrl: 'templates/servicos.html',
                controller: 'ServicosCtrl'
            }
        }
    })

    .state('app.servico', {
        url: '/servico/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/servico.html',
                controller: 'ServicoCtrl'
            }
        }
    })

    .state('app.cartilha', {
        url: '/cartilha',
        views: {
            'menuContent': {
                templateUrl: 'templates/cartilha.html',
                controller: 'CartilhaCtrl'
            }
        }
    })  

    .state('app.localizacao', {
        url: '/localizacao',
        views: {
            'menuContent': {
                templateUrl: 'templates/localizacao.html',
                controller: 'LocalizacaoCtrl'
            }
        }
    })
    .state('app.telefones', {
        url: '/telefones',
        views: {
            'menuContent': {
                templateUrl: 'templates/telefones.html'
            }
        }
    })
    .state('app.notificacoes', {
        url: '/notificacoes',
        views: {
            'menuContent': {
                templateUrl: 'templates/notificacoes.html',
                controller: 'NotificacaoCtrl'
            }
        }
    })
  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/index');
});
