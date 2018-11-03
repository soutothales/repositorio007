angular.module("portal").controller("users-controller", function($scope, $http, $location,  $translate, perfilService, SessionService, Constants
														, $rootScope){



	$scope.MAIN_URL = Constants.MAIN_URL;
    $scope.SALA_URL = Constants.SALA_URL;
	$scope.users = [];

	$scope.token = JSON.parse(localStorage.getItem("token"));
	$scope.tab = JSON.parse(localStorage.getItem("nivelUsers"));

	$scope.usersLateral = [];
	$scope.gerentes = [];
	$scope.coaches = [];
	$scope.alunosAndCoaches = [];


    $scope.podeCriar;

    $scope.actionModal = 'show';

    if(SessionService.getUser().nivel != 'admin' && SessionService.getUser().nivel != 'gerente') {
        $scope.podeCriar = false;
    } else {
        $scope.podeCriar = true;
    }

	perfilService.getUsers($scope.tab);

	$scope.state.loading = true;

	$http.get(Constants.USER_URL, {
			params: {nivel: $scope.tab}
    }).then(function successCallback(response) {
			if (response.data.users != undefined) {

				$scope.users = response.data.users;
				$scope.usersLateral = response.data.users;
				adicionaCores($scope.users);

				for (var i = 0; i < $scope.users.length; i++) {
					if ($scope.users[i].nivel === "aluno") {
						$scope.alunosAndCoaches.push($scope.users[i]);
					} else if ($scope.users[i].nivel === "coach") {
						$scope.coaches.push($scope.users[i]);
					} else if ($scope.users[i].nivel === "gerente") {
						$scope.gerentes.push($scope.users[i]);
					}
				}
			}
			$scope.state.loading = false;
    }, function errorCallback(response) {
			$scope.state.loading = false;
			console.log(response);
  	});

	$scope.getUsers = function(nivel) {
		$scope.state.loading = true;
		$scope.tab = nivel;

		var data;
		if (nivel != undefined && nivel.trim() != "") {
			data = {
				nivel: nivel
			}
		} else {
			$scope.tab = "";
		}

		$http.get(Constants.USER_URL, {params: data,
	    }).then(function successCallback(response) {
				if (response.data.users != undefined) {
	      	$scope.users = response.data.users;
					adicionaCores($scope.users);
				}
				$scope.state.loading = false;
	    }, function errorCallback(response) {
				$scope.state.loading = false;
				// console.log(response);
	  });
	}

	$scope.showUsers = function(nivel) {
		if (nivel === "aluno") {
			preencheLista($scope.alunosAndCoaches);
		} else if (nivel === "coach") {
			preencheLista($scope.coaches);
		} else if (nivel == "gerente") {
			preencheLista($scope.gerentes);
		} else {
			preencheLista($scope.users);
		}
		$scope.tab = nivel;
	}

	var preencheLista = function(lista) {
		$scope.usersLateral = [];
		for (var i = 0; i < lista.length; i++) {
			if(lista[i].agenda){
				$scope.usersLateral.push(lista[i]);
			}
		}
	}

	var adicionaCores = function(users) {
		for (var i = 0; i < users.length; i++) {
			users[i].cor = getRandomColor();
		}
	}

	$scope.modalCriarUser = function (action) {
        $('#registrar').modal(action);
    }

	$scope.criarUser = function() {
		var user = {
			nome: $scope.nome,
			login: $scope.loginUser,
			senha: $scope.senha,
			nivel: $scope.nivel,
			email: $scope.email
		}

		perfilService.criarUser(user, function success() {
			$rootScope.$broadcast('responseSuccess', 'Usuário criado com sucesso.');
            $scope.blankInputs('criarUser');
            $scope.actionModal = 'hide';
            $scope.modalCriarUser($scope.actionModal);
        }, function error() {

        });

	}

	$scope.blankInputs = function(id) {
		$('#' + id).each (function(){
  		this.reset();
		});
	}

	function getRandomColor() {
    var color = '#';
		var hexnum;
    for (var i = 1; i <= 3; i++ ) {
			hexnum = String("0" + Math.floor((Math.random() * 170) + 1).toString(16)).slice(-2);
      color += hexnum;
    }
    return color;
	}

});
