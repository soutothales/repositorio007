angular.module("portal").factory("autenticService", function($http, $state, Constants, SessionService) {

	var autenticacaoService = {};

  	autenticacaoService.login = function(user, callback) {
		authenticate(user, callback);
	};

	autenticacaoService.logout = function(unauthorizedResponseError) {
		if(unauthorizedResponseError){
			SessionService.removeSession();
			$state.go("login");
		}

		$http.post(Constants.LOGOUT).then(function (response) {
			console.log("deslogou");
			SessionService.removeSession();
			$state.go("login");
		}, function(response) {
			return;
		});
	};

	function authenticate(user, callback) {
		$http.post(Constants.LOGIN_URL, user).then(function (data) {
			SessionService.generateSession(data.data.user, data.data.token);
			$state.go("app.users");
			callback(false);
		}, function(response) {
			console.log(response);
			callback(true);
		});
	};

	return autenticacaoService;
});
