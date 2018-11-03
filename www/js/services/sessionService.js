angular.module('portal').factory('SessionService', function($http, $localStorage) {

	var Session = {};

	Session.generateSession = function(user, token) {
		$localStorage.session = {'user': user,
								 'token': token };
	};

	Session.getUser = function() {
		if($localStorage.session)
			return $localStorage.session.user;

		return null;
	};

	Session.setUser = function(user) {
		$localStorage.session.user = user;
	};

	Session.getToken = function() {
		if($localStorage.session)
			return $localStorage.session.token;

		return null;
	};

	Session.removeSession = function() {
		delete $localStorage.session;
	};

	Session.podeEditar = function (user) {
		var verifica = (user.id === Session.getUser().id ||
			(Session.getUser().nivel === 'coach' && user.nivel === 'aluno'
			&& user.projeto === Session.getUser().projeto) ||
			(Session.getUser().nivel === 'gerente' && (user.nivel === 'coach'
			|| Session.getUser().nivel === 'aluno')) || Session.getUser().nivel === 'admin');
		console.log('podeEditar: ' + verifica);
		return verifica;
	};

  return Session;

});
