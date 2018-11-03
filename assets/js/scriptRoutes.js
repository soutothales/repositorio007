angular.module('portal').config(function($routeProvider, $translateProvider){

  $routeProvider.when("/", {
    templateUrl: "/templates/home.html",
    controller: "main-controller"
  });

  $routeProvider.when("/perfil", {
    templateUrl: "/templates/perfil.html"
  });

  $routeProvider.when("/users", {
    templateUrl: "/templates/users.html",
    controller: "users-controller"
  });

   $routeProvider.when("/agenda", {
    templateUrl: "/templates/pesquisaAgendas.html",
    controller: "pesquisaAgendas-controller",
  });

  $routeProvider.when("/salas", {
   templateUrl: "/templates/salas.html",
   controller: "pesquisaAgendas-controller",
 });

 $routeProvider.when("/projetos", {
  templateUrl: "/templates/projeto.html",
  controller: "pesquisaAgendas-controller",
});

  $routeProvider.otherwise({redirect:"/"});

  $translateProvider.translations('en', {
    'sobre': 'about',

  });

  $translateProvider.translations('pt', {
    'sobre': 'sobre',
  });

  $translateProvider.preferredLanguage('en'); //aqui definimos qual sera a default
  $translateProvider.useSanitizeValueStrategy(null);

});
