angular.module("portal").controller("sala-controller", function($scope, $http, SessionService, Constants, SalaService, $rootScope){

    $scope.salas = [];
    $scope.alunosNaSala = [];
    $scope.alunosSemSala = [];
    $scope.salaSelecionada = "";

    SalaService.alunos(
        function (alunos) {
            for (var i = 0; i < alunos.users.length; i++) {
                if(alunos.users[i].sala === undefined){
                    $scope.alunosSemSala.push(alunos.users[i]);
                }
            }
        // Erro
        }, function (errResponse) {
        }
    );

    SalaService.salas(
        function (salas) {
            $scope.salas = salas;
        // Erro
        }, function (errResponse) {
        }
    );

    $scope.addAluno = function(aluno) {
        SalaService.addAluno(aluno, $scope.salaSelecionada.id,
            function (data) {
				for (var i = 0; i < $scope.salas.length; i++){
					if($scope.salas[i].id === data.sala.id){
						$scope.salas[i] = data.sala;
					}
				}
                $scope.alunosNaSala = data.sala.users;
                $scope.alunosSemSala.splice($scope.alunosSemSala.indexOf(aluno), 1);
            // Erro
            }, function (errResponse) {

            }
        );
    };

    $scope.showAlunosNaSala = function(sala) {
        $scope.salaSelecionada = sala;
        $scope.alunosNaSala = sala.users;
    };

    $scope.removerAluno = function(aluno) {
        SalaService.removerAluno(aluno, $scope.salaSelecionada.id,
            function (data) {
				console.log('removeu');
				for (var i = 0; i < $scope.salas.length; i++){
					if($scope.salas[i].id === data.sala.id){
						$scope.salas[i] = data.sala;
					}
				}
				$scope.alunosNaSala = data.sala.users;
				$scope.alunosSemSala.push(aluno);
            }, function (errResponse) {

            }
        );
    };

	$scope.criarSalaModal = function() {
		$('#criarSalaModal').modal('show');
	};

	$scope.criarSala = function () {
      console.log($scope.localizacao);
		SalaService.criar($scope.localizacao,
			function (data) {
				SalaService.salas(
					function (salas) {
						$scope.salas = salas;
					}
				);
			}
		);
      $scope.localizacao = '';
	};

});
