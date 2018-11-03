angular.module("portal").controller('ViewPerfilCtrl', function($scope, $window, $rootScope, $http, $state, $stateParams, AgendaService, SessionService, UserService,  Constants) {
	$scope.$on('$ionicView.beforeEnter', function(){
		console.log("Ver perfil");
		// Inicia o controller com tela de carregamento
		$rootScope.showLoading();

		$scope.podeEditar = false;

		// Pega usuário da sessão no back
		UserService.getOne($stateParams.id || SessionService.getUser().id,
			// Sucesso
			function (user) {
				$scope.user = user;
				$scope.user.avatarUrl = UserService.getRoundedAvatar(user.avatarUrl);
				// Se for o próprio user, atualiza na sessão
				if(user.id === SessionService.getUser().id) {
					SessionService.setUser(user);
				}
				// Carrega agenda no service
				dadosAgenda = AgendaService.init(user.agenda);
				setDadosAgenda(dadosAgenda);
				$rootScope.hideLoading();
				// Erro
			}, function (errResponse) {
				$scope.user = SessionService.getUser();
				$rootScope.hideLoading();
			}
		);
	});

	function setDadosAgenda(dadosAgenda) {
		$scope.horas = dadosAgenda.horas;
		$scope.horariosEditados = dadosAgenda.horariosEditados;
		$scope.horasTrabalhadas = dadosAgenda.horasTrabalhadas;
	}
});
