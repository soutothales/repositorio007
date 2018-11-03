angular.module('portal').config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('tokenInterceptor');
}]);
