angular.module("portal").factory("perfilService", function($http, SessionService, Constants, $rootScope) {

	var perfilService = {};
	// TODO: AJEITAR AGENDA
	perfilService.visualizarUser = function(id, successCb, errorCb) {
		$http.get(Constants.USER_URL + '/' + id, {})
			.then(function successCallback(response) {
      			successCb(response.data.user);
    		}, function errorCallback(response) {
				errorCb();
    	});
	};

	perfilService.getUsers = function(nivel) {

	};

	perfilService.ver = function(user) {
		SessionService.setPerfil(user);
	};

	perfilService.getTipoUsers = function() {
		return JSON.parse(localStorage.getItem("nivelUsers"));
	};

	perfilService.atualizar = function(url, data) {
		$http.put(url, data).then(function successCallback(response) {
			if(SessionService.verificaPerfilVisualizado()){
        SessionService.setUser(response.data.user);
        SessionService.setPerfil(response.data.user);
      } else {
        SessionService.setPerfil(response.data.user);
      }
		}, function errorCallback(response) {
			// console.log(response);
		});
	};

	perfilService.perfil = function() {
		return SessionService.perfil();
	};

	perfilService.criarUser = function(user, successCb, errorCb) {
		$http.post(Constants.USER_URL, user).then(function (data) {
			// console.log(data);
            //$rootScope.$broadcast('responseSuccess', 'Usuário criado com sucesso.');
			successCb();

		}, function(response) {
			errorCb();
			// console.log(response);
		});
	};

	return perfilService;

});
