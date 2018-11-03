angular.module("portal").controller("pesquisaAgendas-controller", function($scope, $http, SessionService, Constants){


	const DIAS = 6;
	const HORAS = 14;

	$scope.usuariosAdicionados = [];
	$scope.usuariosEncontrados = [];
	$scope.nomeUsuario;
	$scope.horariosEmComum = [[], [], [], [], [], []];
	$scope.horas = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
 									"16:00", "17:00", "18:00", "19:00", "20:00"];

	var iniciaTabela = function(){
		for(var i = 0; i < $scope.horariosEmComum.length; i++){
			for(var j = 7; j <= 20; j++){
				$scope.horariosEmComum[i][j-7] = {hora: j, users: [], checked: false};
			}
		}
	};

	iniciaTabela();

	$scope.toggleUsuario = function(user){
		if($scope.state.loading) return;
		// console.log(user);
		$scope.state.loading = true;
		// Se user existe na agenda, remove
		for (var i = 0; i < $scope.usuariosAdicionados.length; i++) {
			if($scope.usuariosAdicionados[i].id === user.id){
				var remove = $scope.usuariosAdicionados[i];
				$scope.usuariosAdicionados.splice($scope.usuariosAdicionados.indexOf(remove), 1);
				atualizarHorarios();
				$scope.state.loading = false;
				return;
			}
		}

		if(!user.agenda){
			console.log("Usuario nao tem agenda.");
			$scope.growl("Usuário nao possui agenda.", 'erro');
			$scope.state.loading = false;
			return;
		}

		novoUser = JSON.parse(JSON.stringify(user));
		preencherHorarioUser(novoUser);
		$scope.usuariosAdicionados.push(novoUser);
		atualizarHorarios();
		$scope.state.loading = false;
	};

	var atualizarHorarios = function(){
		iniciaTabela();

		for(var u = 0; u < $scope.usuariosAdicionados.length; u++){
			horariosUser = $scope.usuariosAdicionados[u].agenda.horarios;
			for(var i = 0; i < DIAS; i++)	{
				for(var j = 0; j < HORAS; j++)	{
					if(horariosUser[i][j].checked){
						$scope.horariosEmComum[i][j].users.push({nome: $scope.usuariosAdicionados[u].nome, cor: $scope.usuariosAdicionados[u].cor});
						if($scope.horariosEmComum[i][j].users.length === $scope.usuariosAdicionados.length){
							$scope.horariosEmComum[i][j].checked = true;
						}
					}
				}
			}
		}

		// console.log($scope.horariosEmComum);
	};

	var preencherHorarioUser = function(user){
		horarioUser = user.agenda.horarios;
		// console.log(user.agenda);
		horarioConvertido = [[],[],[],[],[],[]];
		for(var i = 0; i < horarioConvertido.length; i++){
			for(var j = 7; j <= 20; j++){
				horarioConvertido[i][j-7] = {hora: j, checked: false};
			}
		}

		for(var i = 0; i < horarioConvertido.length; i++)	{
			for(var j = 0; j < horarioUser[i].length; j++)	{
				for(var k = 0; k < horarioConvertido[i].length; k++)	{
					if(horarioConvertido[i][k].hora === horarioUser[i][j]){
						horarioConvertido[i][k].checked = true;
					}
				}
			}
		}

		user.agenda.horarios = horarioConvertido;
	};

	$scope.limparAgenda = function(){
		$scope.usuariosAdicionados = [];
		atualizarHorarios();
	};

	$scope.getBgColor = function(user){
		// Verifica se usuário foi adicionado à agenda
		for (var i = 0; i < $scope.usuariosAdicionados.length; i++) {
			if($scope.usuariosAdicionados[i].id === user.id){
				return user.cor;
			}
		}

		return "#F9F9F9";
	};

	$scope.getFontColor = function(user){
		// Verifica se usuário foi adicionado à agenda
		for (var i = 0; i < $scope.usuariosAdicionados.length; i++) {
			if($scope.usuariosAdicionados[i].id === user.id){
				return "white";
			}
		}

		return "black";
	};

});
