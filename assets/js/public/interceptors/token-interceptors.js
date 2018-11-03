angular.module('portal').factory('tokenInterceptor',['$injector', '$q', '$rootScope', function($injector, $q, $rootScope) {

	return {
		'request': function(config) {
			if ((JSON.parse(localStorage.getItem("userSession"))) != undefined) {
				config.headers.Authorization =  JSON.parse(localStorage.getItem("token"));
			}

			return config;
		},

		'responseError': function(rejection) {
			console.log(rejection.data.err);
			$rootScope.$broadcast('responseError', rejection.data.err);

			if(rejection.status == 401 && rejection.data.err.toLowerCase().indexOf('token') != -1){
				$rootScope.$broadcast('unauthorizedResponseError');
			}

			return $q.reject(rejection);
		}
	}

}]);
