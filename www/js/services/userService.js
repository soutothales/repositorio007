angular.module('portal').factory('UserService', function($http, $localStorage, SessionService, Constants) {

	var User = {};

	User.getAll = function (successCb, errorCb) {
		$http.get(Constants.USER).then(function successCallback(response) {
			successCb(response.data.users);
		}, function errorCallback(errResponse) {
			errorCb(errResponse);
		});
	};

	User.getByNivel = function (nivel, successCb, errorCb) {
		$http.get(Constants.USER, {
			params: {nivel: nivel},
		}).then(function successCallback(response) {
			successCb(response.data.users);
		}, function errorCallback(errResponse) {
			errorCb(errResponse);
		});
	};

	User.getOne = function (id, successCb, errorCb) {
		$http.get(Constants.USER + '/' + id).then(function successCallback(response) {
			successCb(response.data.user);
		}, function errorCallback(errResponse) {
			errorCb(errResponse);
		});
	};

	User.createUser = function(user, succesCb, errorCb) {
		$http.post(Constants.USER, user).then(function successCallback(response) {
			console.log(response.data);
		}, function errorCallback(errResponse) {
			errorCb(errResponse);
		});
	};

	User.setDescricao = function(id, descricao, succesCb, errorCb) {
		var data = {descricao: descricao};
		$http.put(Constants.USER + "/" + id , data).then(function successCallback(response) {
			succesCb(response.data.user);
		}, function errorCallback(errResponse) {
			errorCb(errResponse);
		});
	};

	User.setCompetencias = function(id, competencias, succesCb, errorCb) {
		var data = {competencias: competencias};
		$http.put(Constants.USER + "/" + id , data).then(function successCallback(response) {
			succesCb(response.data.user);
		}, function errorCallback(errResponse) {
			errorCb(errResponse);
		});
	};

	User.setAvatar = function(imageB64, succesCb, errorCb) {
		var data = {avatarB64: 'data:image/jpeg;base64,' + imageB64};
		$http.put(Constants.AVATAR, data).then(function successCallback(response) {
			succesCb(response.data.user);
		}, function errorCallback(errResponse) {
			errorCb(errResponse);
		});
	};

	User.getRoundedAvatar = function (avatarUrl) {
		var dividedUrl = avatarUrl.split('/');
		dividedUrl.splice(dividedUrl.length - 2,0,'c_lfill,g_face,h_220,w_220');
		return dividedUrl.join('/');
	};

  	return User;

});
