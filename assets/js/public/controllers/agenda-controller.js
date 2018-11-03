angular.module("portal").controller("agenda-controller", function($scope, $http, SessionService, Constants){

	var perfilAtivo;
	var url = 'http://localhost:1337/agenda';

	$scope.podeEditar = SessionService.verificaPerfilVisualizado();
	$scope.horasTrabalhadas = 0;
	$scope.horarios = [[], [], [], [], [], []];
	$scope.horariosEditados;
	$scope.horas = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
	"16:00", "17:00", "18:00", "19:00", "20:00"];

	if(SessionService.verificaPerfilVisualizado()){
		perfilAtivo = SessionService.getUser();
	} else {
		perfilAtivo = SessionService.perfil();
	}

	// console.log(perfilAtivo);

	var duplicarAgenda = function(){
		//converteHorariosToFront(perfilAtivo.agenda.horarios);
		$scope.horariosEditados = JSON.parse(JSON.stringify($scope.horarios));
	};

	function atualizarHorasTrabalhadas(horarios){
		$scope.horasTrabalhadas = 0;
		for(var i = 0; i < $scope.horarios.length; i++){
			for(var j = 0; j < 14; j++){
				if(horarios[i][j].checked) {
					$scope.horasTrabalhadas++;
				}
			}
		}
	}

	// Popula o array com os horários e vê se estão selecionados
	for(var i = 0; i < $scope.horarios.length; i++){
		for(var j = 7; j <= 20; j++){
			$scope.horarios[i][j-7] = {hora: j, checked: false};
		}
	}

	function converteHorariosToFront(horarios){
		for(var i = 0; i < $scope.horarios.length; i++)	{
			for(var j = 0; j < horarios[i].length; j++)	{
				for(var k = 0; k < $scope.horarios[i].length; k++)	{
					if($scope.horarios[i][k].hora === horarios[i][j]){
						$scope.horarios[i][k].checked = true;
					}
				}
			}
		}
		atualizarHorasTrabalhadas($scope.horarios);
	}

	if(!perfilAtivo.agenda) {
		$scope.horariosEditados = JSON.parse(JSON.stringify($scope.horarios));
	} else {
		console.log("agenda: " + SessionService.perfil().agenda);
		$scope.state.loading = true;
		$http.get(Constants.AGENDA_URL + "/" + SessionService.perfil().agenda.id)
		.then(function successCallback(response) {
			converteHorariosToFront(response.data.horarios);
			duplicarAgenda();
			$scope.state.loading = false;
			// console.log("pegou agenda do back");
		});
	}

	var converteHorariosToBack = function(horarios) {
		horariosConvertidos = { horarios : [[], [], [], [], [], []] };

		for(var i = 0; i < $scope.horarios.length; i++){
			for(var j = 0; j < 14; j++){
				if(horarios[i][j].checked) {
					horariosConvertidos.horarios[i].push(horarios[i][j].hora);
				}
			}
		}
		//console.log(horariosConvertidos);

		return horariosConvertidos;
	};

	// Seleciona horários
	$scope.toggleHorario = function(i, j) {
		if(!$scope.editView) return;
		if($scope.horariosEditados[i][j].checked){
			$scope.horariosEditados[i][j].checked = false;
			$scope.horasTrabalhadas--;
		} else {
			$scope.horariosEditados[i][j].checked = true;
			$scope.horasTrabalhadas++;
		}
	};

	$scope.cancelarEdicao = function(){
		console.log("cancelou");
		$scope.horariosEditados = JSON.parse(JSON.stringify($scope.horarios));
		atualizarHorasTrabalhadas($scope.horarios);
	};

	// Salva alterações em horários
	$scope.salvaHorarios = function() {
		$scope.state.loading = true;
		var data = converteHorariosToBack($scope.horariosEditados);
		// console.log(data);

		if(perfilAtivo.agenda) {
			$http.put(Constants.AGENDA_URL + '/' + perfilAtivo.agenda.id, data)
			.then(function successCallback(response) {
				var user = perfilAtivo;
				console.log(JSON.stringify(response.data));
				user["agenda"] = response.data.agenda;
				if(perfilAtivo.id === SessionService.getUser().id)
					SessionService.setUser(user);
				$scope.horarios = JSON.parse(JSON.stringify($scope.horariosEditados));
				atualizarHorasTrabalhadas($scope.horarios);
				$scope.state.loading = false;
				$scope.growl("Agenda atualizada.", 'sucesso');
			}, function errorCallback(response) {
				$scope.cancelarEdicao();
				$scope.state.loading = false;
				console.log(response);
			});

		} else {
			$http.post(Constants.AGENDA_URL, data).then(function successCallback(response) {
				console.log(response);
				var user = perfilAtivo;
				user["agenda"] = response.data.agenda;
				$scope.growl("Agenda atualizada.", 'sucesso');
				if(perfilAtivo.id === SessionService.getUser().id)
					SessionService.setUser(user);
				$scope.state.loading = false;
			}, function errorCallback(response) {
				$scope.cancelarEdicao();
				$scope.state.loading = false;
				console.log(response.err);
			});
		}
	}

});
