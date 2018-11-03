// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('portal', ['ionic', 'ion-floating-menu', 'ngStorage', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaToast, $window) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }

        // Duplicado, pra poder funcionar no navegador
		$rootScope.showLoading = function () {
			$ionicLoading.show({
				template: '<ion-spinner></ion-spinner>'
			})
		};

		$rootScope.hideLoading = function(){
			$ionicLoading.hide();
		};
    });

	$window.document.addEventListener('deviceready', function(){
		$rootScope.showMessage = function (msg) {
			$cordovaToast.show(msg, 'long', 'bottom');
		};

		$rootScope.showLoading = function () {
			$ionicLoading.show({
				template: '<ion-spinner></ion-spinner>'
			})
		};

		$rootScope.hideLoading = function(){
			$ionicLoading.hide();
		};
	});

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js



  $stateProvider

  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })

  .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html"
  })

  .state('app.editPerfil', {
      url: "/editPerfil",
	  views: {
          'menuContent' :{
              templateUrl: "templates/editPerfil.html",
			  controller: 'PerfilCtrl',
			  cache: false
          }
      },
	  params: {id: null}
  })

  .state('app.viewPerfil', {
      url: "/perfil/:id",
      views: {
          'menuContent' :{
              templateUrl: "templates/viewPerfil.html",
			  controller: 'ViewPerfilCtrl',
			  cache: false
          }
      }
  })

  .state('app.users', {
      url: "/users",
      views: {
          'menuContent' :{
              templateUrl: "templates/users.html",
			  controller: 'UsersCtrl',
			  cache: false
          }
      }
  })

  .state('app.agendas', {
      url: "/agendas",
      views: {
          'menuContent' :{
              templateUrl: "templates/agendas.html",
            controller: 'AgendasCtrl',
            cache: false
          }
      }
  })

  .state('app.users-tab', {
      url: "/users-tab",
      views: {
          'menuContent' :{
              templateUrl: "templates/users-tab.html",
              controller: 'UsersTabCtrl',
            cache: false
          }
      }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
  $ionicConfigProvider.tabs.position('bottom');

});
