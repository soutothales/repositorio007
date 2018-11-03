angular.module('portal').factory('SessionService', function($http, $window) {

	var Session = {};

	Session.generateSession = function(user, token) {
	    localStorage.setItem("userSession", JSON.stringify(user));
   	  	localStorage.setItem("token", JSON.stringify(token));
   	  	localStorage.setItem("perfil", JSON.stringify(user));
		localStorage.setItem("nivelUsers", JSON.stringify(""));
	};

	Session.getUser = function() {
		return JSON.parse(localStorage.getItem("userSession"));
	};

	Session.setUser = function(user) {
		localStorage.setItem("userSession", JSON.stringify(user));
		localStorage.setItem("perfil", JSON.stringify(user));

	};

	Session.getToken = function() {
		return JSON.parse(localStorage.getItem("token"));
	};

	Session.setToken = function(token) {

	};

	Session.removeSession = function() {
		localStorage.session;
	};

	Session.perfil = function() {
        return JSON.parse(localStorage.getItem("perfil"));
    };

	Session.setPerfil = function(user) {
		localStorage.setItem("perfil", JSON.stringify(user));
	};

	Session.nivelUsers = function(nivel) {
		localStorage.setItem("nivelUsers", JSON.stringify(nivel));
	};

	// Verifica se usuario pode editar o que ele está visualizando
	Session.podeEditarPerfil = function(){
		var verifica = (Session.perfil().id === Session.getUser().id ||
			(Session.getUser().nivel === 'coach' && Session.perfil().nivel === 'aluno'
			&& ((Session.perfil().projeto && Session.getUser().projeto) &&
				Session.perfil().projeto.nome === Session.getUser().projeto.nome)) ||
			(Session.getUser().nivel === 'gerente' && (Session.perfil().nivel === 'coach'
			|| Session.getUser().nivel === 'aluno')) || Session.getUser().nivel === 'admin');
		return verifica;
	};

	Session.verificaPerfilVisualizado = function(){
		return Session.perfil().id === Session.getUser().id;
	};

	return Session;

});
