angular.module("portal").controller('MainCtrl', function($scope, $state, $ionicSideMenuDelegate, autenticService, SessionService) {
	$scope.isAgenda = false;

	$scope.$on('unauthorizedResponseError', function(event){
		console.log("unauthorized");
		if(event.defaultPrevented)
			return;

		event.defaultPrevented = true;
		autenticService.logout(true);
	});

	$scope.goToPerfil = function () {
		$scope.isAgenda = false;
		$state.go('app.editPerfil', {id: null}, {reload: true});
	};

	$scope.goToUsers = function () {
		$scope.isAgenda = false;
		$state.go('app.users', {}, {reload: true});
	};

	$scope.goToAgendas = function () {
		$scope.isAgenda = true;
		$state.go('app.agendas', {}, {reload: true});
	};

    $scope.logout = function () {
        autenticService.logout();
	};

	$scope.toggleRight = function() {
  		$ionicSideMenuDelegate.toggleLeft();
	};

});
