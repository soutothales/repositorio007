angular.module("portal").controller("main-controller", function($scope, $http, $window, $location, $rootScope, autenticService, SessionService, perfilService){
	$scope.state = {loading: false};
	$scope.logado = false;
	$scope.userSession = SessionService.getUser();

	$scope.$on('updateDados', function (event, data) {
		$scope.userSession = data;
		// console.log(event.targetScope);
	});

	$scope.$on('unauthorizedResponseError', function(event){
		if(event.defaultPrevented)
			return;

		event.defaultPrevented = true;
		autenticService.logout(true);
	});

	$scope.$on('responseError', function(event, msg){
		if(event.defaultPrevented)
			return;

		$scope.growl(msg, 'erro');
		event.defaultPrevented = true;
	});

	$scope.$on('responseSuccess', function(event, msg){
		if(event.defaultPrevented) return;

		$scope.growl(msg, 'sucesso');
		event.defaultPrevented = true;
	});

	$scope.home = function() {
		$window.location.href = "/";
	};

	var isLogado = function(){
		$scope.logado = Boolean(localStorage.getItem("userSession"));
	};

	$scope.login = function(user) {
		autenticService.login(user, function(result) {
			if (result) {
				$window.location.href = "/";
			} else {
				console.log("error");
			}
		});

	};

	$scope.logout = function(){
		autenticService.logout();
	};

	$scope.verMeuPerfil = function() {
		perfilService.visualizarUser($scope.userSession.id, function (userEncontrado) {
			perfilService.ver(userEncontrado);
			if($location.$$path === "/perfil")
				$window.location.reload();
			$location.path("/perfil");
		}, function () {
			$location.path("/");
		});

	};

	$scope.verUsers = function(nivel) {
		SessionService.nivelUsers(nivel);
		$location.path("/users");
	};

    $scope.visualizarUser = function(user) {
        perfilService.visualizarUser(user.id, function (userEncontrado) {
            perfilService.ver(userEncontrado);
            $location.path("/perfil");
        }, function () {
            $location.path("/");
        });
    };

	$scope.agenda = function() {
		SessionService.nivelUsers("");
		$location.path("/agenda");
	};

	$scope.salas = function() {
		$location.path("/salas");
	};

	$scope.projetos = function() {
		$location.path("/projetos");
	};

	isLogado();

	$scope.growl = function(msg, tipo) {
		var params = {title: '', message: msg};

		if (tipo == "sucesso") {
			params.title = "Sucesso";
			$.growl.notice(params);
		} else if (tipo == "erro") {
			params.title = "Erro";
			$.growl.error(params);
		} else if (tipo == "aviso") {
			params.title = "Aviso";
			$.growl.warning(params);
		} else {
			$.growl(params);
		}
	};

	$scope.podeVisualizar = function() {
		if (SessionService.getUser().nivel === "admin" || SessionService.getUser().nivel === "gerente") {
			return true;
		}
		return false;
	};

});
