var perfilController = angular.module("portal").controller('PerfilCtrl', function($scope, $rootScope, $stateParams, $http, $state, $ionicPopup, $cordovaCamera, $cordovaFileTransfer, SessionService, UserService,  AgendaService, focus, Constants) {

	$scope.$on('$ionicView.beforeEnter', function(){
		console.log("Editar perfil / id: " + $scope.id);
		console.log($cordovaCamera);
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
				if(user.id === SessionService.getUser().id){
					SessionService.setUser(user);
					$scope.podeEditar = true;
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

	$scope.editDescricao = false;
	$scope.editCompetencias = false;
	$scope.editAgenda = false;

	function setDadosAgenda(dadosAgenda) {
		$scope.horas = dadosAgenda.horas;
		$scope.horariosEditados = dadosAgenda.horariosEditados;
		$scope.horasTrabalhadas = dadosAgenda.horasTrabalhadas;
	}

	/* ---------------------------------- DESCRIÇÃO ---------------------------------- */
	var descricaoOriginal;
	$scope.editarDescricao = function () {
		focus('inputDescricao');
		if($scope.editDescricao) return;

		descricaoOriginal = $scope.user.descricao;
		$scope.editDescricao = true;
	};


	$scope.cancelarDescricao = function () {
		$scope.user.descricao = descricaoOriginal;
		$scope.editDescricao = false;
	};

	$scope.confirmarDescricao = function () {
		$rootScope.showLoading();

		UserService.setDescricao($scope.user.id, $scope.user.descricao,
			// Sucesso
			function (user) {
				$scope.user.descricao = user.descricao;
				$scope.editDescricao = false;
				$rootScope.hideLoading();
				// Erro
			}, function (errResponse) {
				$rootScope.hideLoading();
			}
		);
	};

	/* ---------------------------------- COMPETÊNCIAS ---------------------------------- */
	$scope.abrirPopupCompetencias = function() {
		$scope.data = {};

		// An elaborate, custom popup
		var competenciasPopup = $ionicPopup.show({
			template: '<input ng-model="data.novaCompetencia" autofocus>',
			title: 'Nova habilidade',
			subTitle: 'Digite uma habilidade que você deseja adicionar. (Não utilize vírgulas!)',
			scope: $scope,
			buttons: [
				{text: 'Cancelar'},
				{
					text: '<b>Adicionar</b>',
					type: 'darker-bg',
					onTap: function (e) {
						// Nao deixa fechar se não digitou algo válido
						if (!$scope.data.novaCompetencia || $scope.data.novaCompetencia.split(',').length > 1 ||
							!$scope.data.novaCompetencia.trim()) {
							console.log($scope.data.novaCompetencia);
							$scope.novaCompetencia = '';
							e.preventDefault();
						} else {
							$rootScope.showLoading();
							var competenciasCopy = JSON.parse(JSON.stringify($scope.user.competencias));
							competenciasCopy.push($scope.data.novaCompetencia.trim());
							UserService.setCompetencias($scope.user.id, competenciasCopy, function (userAtualizado) {
								novaCompetencia = '';
								$scope.user.competencias = userAtualizado.competencias;
								$rootScope.hideLoading();
							});
						}
					}
				}
			]
		});
	};

	$scope.deletarCompetencia = function(competencia) {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Excluir habilidade',
			template: 'Você tem certeza que deseja excluir essa habilidade (' + competencia + ')?'
		});

		confirmPopup.then(function(res) {
			if(res) {
				$rootScope.showLoading();
				var competenciasCopy = JSON.parse(JSON.stringify($scope.user.competencias));
				competenciasCopy.splice(competenciasCopy.indexOf(competencia), 1);
				UserService.setCompetencias($scope.user.id, competenciasCopy, function (userAtualizado) {
					$scope.user.competencias = userAtualizado.competencias;
					$rootScope.hideLoading();
				});
			}
		});
	};

	/* ---------------------------------- AGENDA ---------------------------------- */
	$scope.editarAgenda = function () {
		$scope.editAgenda = true;
	};

	$scope.mudaHorario = function (i, j) {
		if(!$scope.editAgenda) return;
		setDadosAgenda(AgendaService.toggleHorario(i, j));
	};

	$scope.cancelarEdicaoAgenda = function () {
		setDadosAgenda(AgendaService.cancelarEdicao());
		$scope.editAgenda = false;
	};


	$scope.salvarHorarios = function () {
		$rootScope.showLoading();

		AgendaService.salvarHorarios(function sucesso(dadosAgenda) {
			setDadosAgenda(dadosAgenda);
			$rootScope.hideLoading();
		}, function erro(dadosAgenda) {
			console.log("Erro ao salvar horarios");
			setDadosAgenda(dadosAgenda);
			$rootScope.hideLoading();
		});

		$scope.editAgenda = false;
	};

	/* ---------------------------------- AVATAR ---------------------------------- */

	$scope.uploadAvatar = function () {
		// Só o próprio usuário pode mudar o avatar
		if(!$scope.podeEditar) return;

		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			//targetWidth: 100,
			//targetHeight: 100,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false,
			correctOrientation:true
		};

		$cordovaCamera.getPicture(options).then(function(imageDataB64) {
			$rootScope.showLoading();
			UserService.setAvatar(imageDataB64, function sucesso(user) {
				$scope.user.avatarUrl = $scope.user.avatarUrl = UserService.getRoundedAvatar(user.avatarUrl);
				$rootScope.hideLoading();
			}, function (erro) {
				$rootScope.hideLoading();
			});
		}, function(err) {
			console.log("erro no upload de avatar");
		});
	}

});
