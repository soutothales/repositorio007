angular.module("portal").factory("SalaService", function($http, SessionService, Constants, $rootScope) {

    Sala = {};

    Sala.listaSalas = function() {
        $http.get(Constants.SALA_URL).then(function (data) {
            console.log(data);
        }, function(response) {
            console.log(response);
        });
    };

    Sala.alunos = function(successCb, errorCb) {
        $http.get(Constants.USER_URL, {
            params: {nivel: 'aluno'},
        }).then(function successCallback(response) {
            successCb(response.data);
        }, function errorCallback(errResponse) {
            errorCb(errResponse);
        });
    };

    Sala.salas = function(successCb, errorCb) {
        $http.get(Constants.SALA_URL).then(function successCallback(response) {
            successCb(response.data);
        }, function errorCallback(errResponse) {
            errorCb(errResponse);
        });
    };

    Sala.addAluno = function(aluno, idSala, successCb, errorCb) {
        $http.put(Constants.SALA_URL + "/" + idSala + "/add" + "/" + aluno.id, aluno).then(function successCallback(response) {
            console.log(response.data);
            successCb(response.data);
		}, function errorCallback(errResponse) {
			errorCb(errResponse);
		});
    };

    Sala.removerAluno = function(aluno, idSala, successCb, errorCb) {
        $http.put(Constants.SALA_URL + "/" + idSala + "/remove" + "/" + aluno.id, aluno).then(function successCallback(response) {
            successCb(response.data);
        }, function errorCallback(errResponse) {
            errorCb(errResponse);
        });
    };

    Sala.criar = function(localizacao, successCb, errorCb) {
        $http.post(Constants.SALA_URL, {localizacao: localizacao}).then(function successCallback(response) {
            successCb(response.data);
        }, function errorCallback(errResponse) {
            errorCb(errResponse);
        });
    };

    return Sala;
});
