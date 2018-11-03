angular.module("portal").controller("projeto-controller", function($scope, $http, SessionService, Constants, ProjetoService, $rootScope){

    $scope.alunosAndCoaches = [];
    $scope.projetos = [];
    $scope.alunosAndCoachesNoProjeto = [];
    $scope.projetoSelecionado = "";

    ProjetoService.alunos(
        function (alunos) {
            for (var i = 0; i < alunos.users.length; i++) {
                if(!alunos.users[i].projeto){
                    $scope.alunosAndCoaches.push(alunos.users[i]);
                }
            }
        // Erro
        }, function (errResponse) {
        }
    );

    ProjetoService.coaches(
        function (coaches) {
            for (var i = 0; i < coaches.users.length; i++) {
                if(!coaches.users[i].projeto){
                    $scope.alunosAndCoaches.push(coaches.users[i]);
                }
            }
        // Erro
        }, function (errResponse) {
        }
    );

    ProjetoService.projetos(
        function (projetos) {
            $scope.projetos = projetos;
        // Erro
        }, function (errResponse) {
        }
    );

    $scope.addUser = function(user) {
        ProjetoService.addUser(user, $scope.projetoSelecionado.id,
            function (data) {
				for (var i = 0; i < $scope.projetos.length; i++){
					if($scope.projetos[i].id === data.projeto.id){
						$scope.projetos[i] = data.projeto;
					}
				}
                $scope.alunosAndCoachesNoProjeto = data.projeto.users;
				$scope.alunosAndCoaches.splice($scope.alunosAndCoaches.indexOf(user), 1);
            // Erro
            }, function (errResponse) {

            }
        );
    };

    $scope.showAlunosNoProjeto = function(projeto) {
        $scope.projetoSelecionado = projeto;
        $scope.alunosAndCoachesNoProjeto = projeto.users;
    };

    $scope.removerUser = function(user) {
        ProjetoService.removerUser(user, $scope.projetoSelecionado.id,
            function (data) {
				for (var i = 0; i < $scope.projetos.length; i++){
					if($scope.projetos[i].id === data.projeto.id){
						$scope.projetos[i] = data.projeto;
					}
				}
				$scope.alunosAndCoachesNoProjeto = data.projeto.users;
				$scope.alunosAndCoaches.push(user);
            }, function (errResponse) {

            }
        );
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


    $scope.criarProjeto = function () {
        ProjetoService.criarProjeto($scope.nome,
            function (data) {
                ProjetoService.projetos(
                    function (projetos) {
                        $scope.projetos = projetos;
                    }
                );
            }
        );
      $scope.nome = '';
    };

    $scope.criarProjetoModal = function() {
        $('#criarProjetoModal').modal('show');
    };


});
