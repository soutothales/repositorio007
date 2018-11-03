angular.module('portal').factory('tokenInterceptor',['$injector', '$q', '$rootScope', '$localStorage', function($injector, $q, $rootScope, $localStorage) {

	return {
		'request': function(config) {
			if ($localStorage.session != undefined) {
				config.headers.Authorization =  $localStorage.session.token;
			}

			return config;
		},

		'responseError': function(rejection) {
			console.log('Erro: ' + rejection.data.err);
			// Mostra mensagem de erro

			if(rejection.status == 401 && rejection.data.err.toLowerCase().indexOf('token') != -1){
				$rootScope.$broadcast('unauthorizedResponseError');
			}

			$rootScope.showMessage(rejection.data.err);

			return $q.reject(rejection);
		}
	}

}]);
