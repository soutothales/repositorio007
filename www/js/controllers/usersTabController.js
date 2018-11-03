angular.module("portal").controller('UsersTabCtrl', function($scope, $state, autenticService, $rootScope, SessionService, UserService) {

    $scope.todos = [];
    $scope.alunos = [];
    $scope.coaches = [];
    $scope.gerentes = [];
    $scope.users = [];

    $scope.$on('$ionicView.beforeEnter', function() {
        // Inicia o controller com tela de carregamento
        $rootScope.showLoading();

        if($scope.users.length === 0) {
            UserService.getAll(
                // Sucesso
                function (users) {
                    $scope.todos = users;
                    adicionaCores($scope.todos);
                    $scope.users = $scope.todos;
                    $rootScope.hideLoading();
                // Erro
                }, function (errResponse) {
                    $rootScope.hideLoading();
            });
        }
    });




    $scope.preencheListas = function () {
        if ($scope.alunos.length === 0) {
            for (var i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].nivel === "aluno") {
                    $scope.alunos.push($scope.users[i]);
                } else if ($scope.users[i].nivel === "coach") {
                    $scope.coaches.push($scope.users[i]);
                } else if ($scope.users[i].nivel === "gerente") {
                    $scope.gerentes.push($scope.users[i]);
                }
            }
        }
    };
    $scope.preencheListas();


    $scope.viewByNivel = function(nivel) {

        $scope.users = [];
        if (nivel === "aluno") {
            console.log($scope.alunos)
            console.log(nivel);
            $scope.users = $scope.alunos;
        } else if (nivel === "coach") {
            $scope.users = $scope.coaches;
            console.log(nivel);

        } else if (nivel === "gerente") {
            console.log(nivel);

            $scope.users = $scope.gerentes;
        } else {
            console.log(nivel);

            $scope.users = $scope.todos;
        }
    };

    var adicionaCores = function(users) {
    	for (var i = 0; i < users.length; i++) {
    		users[i].cor = getRandomColor();
    	}
    };


    function getRandomColor() {
        var color = '#';
		var hexnum;
        for (var i = 1; i <= 3; i++ ) {
			hexnum = String("0" + Math.floor((Math.random() * 170) + 1).toString(16)).slice(-2);
            color += hexnum;
        }
        return color;
	};

});
