angular.module("portal").controller('UsersCtrl', function($scope, $http, $state, $ionicModal, autenticService, $rootScope, Constants, SessionService, UserService) {

	$scope.users = [];

	$scope.$on('$ionicView.beforeEnter', function() {
		console.log("Usuários");
		// Inicia o controller com tela de carregamento
		$rootScope.showLoading();

		$scope.users = [];

		UserService.getAll(
			// Sucesso
			function (users) {
				$scope.users = users;
				$rootScope.hideLoading();
				// Erro
			}, function (errResponse) {
				$rootScope.hideLoading();
			}
		);
	});

  	$scope.viewUser = function (user) {
	    if(SessionService.podeEditar(user)){
		    $state.go('app.editPerfil', {id: user.id}, {reload: true});
	    } else {
		    $state.go('app.viewPerfil', {id: user.id}, {reload: true});
	    }
    };

    $ionicModal.fromTemplateUrl('templates/createUserModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });


    $scope.viewAll = function() {
		$rootScope.showLoading();

        UserService.getAll(

  		// Sucesso
  		    function (users) {
  			    $scope.users = users;
				$rootScope.hideLoading();

  			// Erro
  		    }, function (errResponse) {
  	    });
    };

    $scope.viewByNivel = function(nivel) {

		$rootScope.showLoading();


        UserService.getByNivel(nivel,
    		// Sucesso
    		function (users) {
    			$scope.users = users;
				$rootScope.hideLoading();

    			// Erro
    		}, function (errResponse) {


    	});
    };

    $scope.createUser = function(newUser) {

		$rootScope.showLoading();

        UserService.createUser(newUser,
    		// Sucesso
    		function () {
    			// Erro
				$rootScope.hideLoading();
                $scope.newUser = undefined;
    		}, function (errResponse) {
    	});
    };

});
