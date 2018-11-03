angular.module("portal").controller('AgendasCtrl', function($scope, $state) {

    const DIAS = 6;
    const HORAS = 14;

    $scope.diaSelecionado = 0;
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

});
