angular.module("portal").factory("autenticService", function($window, $http, SessionService, Constants) {

	var autenticacaoService = {};


	autenticacaoService.login = function(user, callback) {
		//Pode passar o login e a senha separadas e fazer a verificação no metodo abaixo
		//var user = createUser(entryinfo, password);
		authenticate(user, callback);
	}

	autenticacaoService.logout = function(unauthorizedResponseError) {
		if(unauthorizedResponseError){
			localStorage.removeItem("userSession");
			localStorage.removeItem("token");
			$window.location.href = "/";
		}

		$http.post(Constants.LOGOUT_URL).then(function (response) {
				localStorage.removeItem("userSession");
				$window.location.href = "/";
		}, function(response) {
			return;
		});

	}

	function authenticate(user, callback) {
		$http.post(Constants.LOGIN_URL, user).then(function (data) {
			console.log(data);
			SessionService.generateSession(data.data.user, data.data.token);
			SessionService.setPerfil(data.data.user);
			callback(true);
		}, function(response) {
			//colocar mensagem de erro
			callback(false);
		});
	}

	return autenticacaoService;

});
