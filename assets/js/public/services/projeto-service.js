angular.module("portal").factory("ProjetoService", function($http, SessionService, Constants, $rootScope) {

    Projeto = {};



    Projeto.criarProjeto = function(nomeProjeto, successCb, errorCb) {
        projetoTeste = {
            nome: nomeProjeto
        }
        $http.post(Constants.PROJETO_URL, projetoTeste).then(function successCallback(response) {
            successCb(response.data);
        }, function errorCallback(errResponse) {
            errorCb(errResponse);
        });
    };

    Projeto.listaProjetos = function() {
        $http.get(Constants.PROJETO_URL).then(function (data) {
            console.log(data);
        }, function(response) {
            console.log(response);
        });
    };

    Projeto.alunos = function(successCb, errorCb) {
        $http.get(Constants.USER_URL, {
            params: {nivel: 'aluno'},
        }).then(function successCallback(response) {
            successCb(response.data);
        }, function errorCallback(errResponse) {
            errorCb(errResponse);
        });
    };

    Projeto.coaches = function(successCb, errorCb) {
        $http.get(Constants.USER_URL, {
            params: {nivel: 'coach'},
        }).then(function successCallback(response) {
            successCb(response.data);
        }, function errorCallback(errResponse) {
            errorCb(errResponse);
        });
    };

    Projeto.projetos = function(successCb, errorCb) {
        $http.get(Constants.PROJETO_URL).then(function successCallback(response) {
            successCb(response.data);
        }, function errorCallback(errResponse) {
            errorCb(errResponse);
        });
    };

    Projeto.addUser = function(user, idProjeto, successCb, errorCb) {
        $http.put(Constants.PROJETO_URL + "/" + idProjeto + "/add/" + user.id, user).then(function successCallback(response) {
            successCb(response.data);
		}, function errorCallback(errResponse) {
			errorCb(errResponse);
		});
    };

    Projeto.removerUser = function(user, idProjeto, successCb, errorCb) {
        $http.put(Constants.PROJETO_URL + "/" + idProjeto + "/remove/" + user.id, user).then(function successCallback(response) {
            successCb(response.data);
        }, function errorCallback(errResponse) {
            errorCb(errResponse);
        });
    };

    return Projeto;
});
