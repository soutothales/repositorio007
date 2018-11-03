angular.module("portal").controller("perfil-controller",
['$scope', '$http', '$window', '$location',  '$translate', 'SessionService', 'perfilService', 'Upload', '$timeout', 'Constants',
function($scope, $http, $window, $location,  $translate, SessionService, perfilService, Upload, $timeout, Constants){

	$scope.salas = [];

	$scope.podeMudarAvatar = false;
	if(SessionService.verificaPerfilVisualizado()) {
		SessionService.setUser(SessionService.perfil());
        $scope.podeMudarAvatar = true;
	}
	$scope.user = SessionService.perfil();
	// console.log($scope.user);
	$scope.descricao = $scope.user.descricao;
	$scope.podeEditar = SessionService.podeEditarPerfil();
	$scope.loading = false;

	$scope.verPerfil = function() {
		$location.path("/perfil");
	};

	$scope.editarDescricao = function() {
		$scope.editandoDescricao = !$scope.editandoDescricao;
	};

	$scope.editarCompetencias = function(){
		$scope.editandoCompetencias = !$scope.editandoCompetencias;
	};

	$scope.atualizarDescricao = function(id) {
		$scope.state.loading = true;
		var data = {descricao: $scope.descricao};
		$http.put(Constants.USER_URL + "/" + $scope.user.id , data).then(function successCallback(response) {
			if(SessionService.verificaPerfilVisualizado()){
				SessionService.setUser(response.data.user);
				SessionService.setPerfil(response.data.user);
			} else {
				SessionService.setPerfil(response.data.user);
			}
			$scope.state.loading = false;
		}, function errorCallback(response) {
			$scope.state.loading = false;
			console.log(response);
		});

		$scope.editandoDescricao = false;
	};

	// Não mexer
	$scope.editarPerfilModal = function() {
		$('#addhor').modal('show');
		$scope.email = $scope.user.email;
		$scope.nome = $scope.user.nome;
	};

	// Não mexer
	$scope.alterarSenhaModal = function() {
		$('#alterarSenha').modal('show');
	};

	$scope.alterarSenha = function() {

		if ( $scope.senhaAtual === null ||  $scope.novaSenha === null || $scope.novaSenhaConfirmar === null) {
		} else {
			if ($scope.novaSenha === $scope.novaSenhaConfirmar) {

				data = {
					senhaAtual: $scope.senhaAtual,
					novaSenha: $scope.novaSenha
				}
				$http.put(Constants.USER_URL + "/" + $scope.user.id, data).then(function successCallback(response) {
					if(SessionService.verificaPerfilVisualizado()){
						SessionService.setUser(response.data.user);
						SessionService.setPerfil(response.data.user);
					} else {
						SessionService.setPerfil(response.data.user);
					}
					$scope.growl("Senha atualizada.", 'sucesso');
					console.log("Senha atualizada");
				}, function errorCallback(response) {
					console.log(response);
				});
			} else {
				$scope.growl("Senhas não coincidem.", 'erro');
			}
		}

	};


	$scope.updateDados = function() {

		var data = {
			nome: $scope.nome,
			email: $scope.email
		};
		console.log(data);
		//lEMBRAR DE TIRAR ISSO DEPOIS
		$http.put(Constants.USER_URL + "/" + $scope.user.id, data).then(function successCallback(response) {
			console.log($scope.user);
			if(SessionService.verificaPerfilVisualizado()){
				SessionService.setUser(response.data.user);
				SessionService.setPerfil(response.data.user);
			} else {
				SessionService.setPerfil(response.data.user);
			}
			$scope.user.nome = response.data.user.nome;
			$scope.user.email = response.data.user.email;
			$scope.$emit('updateDados', $scope.user);
			$scope.growl("Perfil atualizado.", 'sucesso');
		}, function errorCallback(response) {
			console.log(response);
		});

		console.log($scope.user);
	};

	$scope.abrirUploadDialog = function(){
		$timeout(function(){
			var el = document.getElementById('uploadBtn');
			angular.element(el).triggerHandler('click');
		}, 0);
	};

	$scope.upload = function (file) {
		if($scope.loading || !file){
			return;
		}

		$scope.loading = true;
		console.log(file);

		if(file.size >= 10000000){
			$scope.loading = false;
			$scope.growl("Arquivo deve ser menor que 10MB.", 'erro');
			console.log("Arquivo muito grande.");
			return;
		}

		if(file.type.split('/')[0] != "image"){
			$scope.loading = false;
			$scope.growl("Arquivo deve ser uma imagem.", 'erro');
			console.log("Arquivo não é imagem.");
			return;
		}
		Upload.upload({
			url: Constants.USER_AVATAR_URL,
			data: {avatar: file}
		}).then(function (response) {
			console.log('Success ' + response.data.user);
			if(SessionService.verificaPerfilVisualizado()){
				SessionService.setUser(response.data.user);
				SessionService.setPerfil(response.data.user);
			} else {
				SessionService.setPerfil(response.data.user);
			}
			$scope.user.avatarUrl = response.data.user.avatarUrl;
			$scope.loading = false;
			$scope.growl("Avatar atualizado.", 'sucesso');
			// Erro
		}, function (resp) {
			$scope.loading = false;
			console.log('Error status: ' + resp.status);
		}, function (evt) {
			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			console.log('progress: ' + progressPercentage);
		});
	};

	/* TAGS RELATED */
	$scope.inputTags = [];

	var mostrarCompetencias = function(user) {
		// console.log($scope.user);
		var competencias;
		if(!user.competencias || user.competencias.length == 0){
			competencias = [];
		} else {
			competencias = user.competencias;
		}

		$scope.inputTags = [];
		for (var i = 0; i < competencias.length; i++) {
			$scope.inputTags.push({name:competencias[i]});
		}

	};

	$scope.addTag = function() {
		if ($scope.tagText.trim().length == 0 ||
			$scope.tagText.trim().split(",").length > 2 || $scope.tagText.trim().length > 100) {
			$scope.tagText = '';
			return;
		}

		$scope.inputTags.push({name: $scope.tagText.trim().split(",")[0]});

		$scope.tagText = '';
	};

	$scope.checkIfEnterKeyWasPressed = function($event){
		var keyCode = $event.which || $event.keyCode;

		if(keyCode === 13) {
			$scope.addTag();
		}
	};

	$scope.tagListener = function($event){
		if($scope.tagText.lastIndexOf(",") > 0){
			$scope.addTag();
		} else if ($scope.tagText.lastIndexOf(",") == 0) {
			$scope.tagText = '';
		}
	};

	$scope.deleteTag = function(key) {
		if ($scope.inputTags.length > 0 && key === undefined) {
			$scope.inputTags.pop();
		} else if (key != undefined) {
			$scope.inputTags.splice(key, 1);
		}
	};

	$scope.atualizarCompetencias = function() {
		console.log($scope.inputTags);
		var data = {competencias:[]};
		var url = Constants.USER_URL + perfilService.perfil().id;

		for (var i = 0; i < $scope.inputTags.length; i++) {
			data.competencias.push($scope.inputTags[i].name);
		}

		perfilService.atualizar(Constants.USER_URL + '/' + $scope.user.id, data);
		$scope.editandoCompetencias = false;
	};

	mostrarCompetencias($scope.user);
}]);
