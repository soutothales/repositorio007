 angular.module('portal').factory('AgendaService', function($http, $localStorage, SessionService, Constants) {
	var agendaService = {};

	agendaService.agenda;
	agendaService.horasTrabalhadas = 0;
	agendaService.horarios = [[], [], [], [], [], []];
	agendaService.horariosEditados;
	agendaService.horas = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
		"16:00", "17:00", "18:00", "19:00", "20:00"];

	agendaService.getDados = function () {
		return {
			horasTrabalhadas: this.horasTrabalhadas,
			horariosEditados: this.horariosEditados,
			horas: this.horas
		};
	};

	agendaService.duplicarAgenda = function(){
		this.horariosEditados = JSON.parse(JSON.stringify(this.horarios));
	};

	agendaService.atualizarHorasTrabalhadas = function (horarios){
		this.horasTrabalhadas = 0;
		for(var i = 0; i < this.horarios.length; i++){
			for(var j = 0; j < 14; j++){
				if(horarios[i][j].checked) {
					this.horasTrabalhadas++;
				}
			}
		}
	};

	agendaService.converteHorariosToFront = function (horarios){
		for(var i = 0; i < this.horarios.length; i++)	{
			for(var j = 0; j < horarios[i].length; j++)	{
				for(var k = 0; k < this.horarios[i].length; k++)	{
					if(this.horarios[i][k].hora === horarios[i][j]){
						this.horarios[i][k].checked = true;
					}
				}
			}
		}
		this.atualizarHorasTrabalhadas(this.horarios);
	};

	agendaService.converteHorariosToBack = function(horarios) {
		var horariosConvertidos = { horarios : [[], [], [], [], [], []] };

		for(var i = 0; i < this.horarios.length; i++){
			for(var j = 0; j < 14; j++){
				if(horarios[i][j].checked) {
					horariosConvertidos.horarios[i].push(horarios[i][j].hora);
				}
			}
		}

		return horariosConvertidos;
	};

	agendaService.init = function (agenda) {
		// Popula o array com os horários e vê se estão selecionados
		for(var i = 0; i < this.horarios.length; i++){
			for(var j = 7; j <= 20; j++){
				this.horarios[i][j-7] = {hora: j, checked: false};
			}
		}

		if(!agenda) {
			this.horariosEditados = JSON.parse(JSON.stringify(this.horarios));
			this.agenda = null;
		} else {
			this.agenda = agenda;
			this.converteHorariosToFront(agenda.horarios);
			this.duplicarAgenda();
		}

		return this.getDados();
	};

	 // Seleciona horários
	 agendaService.toggleHorario = function(i, j) {
		 if(this.horariosEditados[i][j].checked){
			 this.horariosEditados[i][j].checked = false;
			 this.horasTrabalhadas--;
		 } else {
			 this.horariosEditados[i][j].checked = true;
			 this.horasTrabalhadas++;
		 }

		 return this.getDados();
	 };

	 agendaService.cancelarEdicao = function(){
		 this.horariosEditados = JSON.parse(JSON.stringify(this.horarios));
		 this.atualizarHorasTrabalhadas(this.horarios);

		 return this.getDados();
	 };

	 // Salva alterações em horários
	 // Sempre retorna a agenda nos callbacks
	 agendaService.salvarHorarios = function(successCb, errorCb) {
		 var data = this.converteHorariosToBack(this.horariosEditados);

		 if(this.agenda) {
			 $http.put(Constants.AGENDA + '/' + this.agenda.id, data)
				 .then(function successCallback(response) {
					 agendaService.horarios = JSON.parse(JSON.stringify(agendaService.horariosEditados));
					 agendaService.atualizarHorasTrabalhadas(agendaService.horarios);
					 successCb(agendaService.getDados());
				 }, function errorCallback(response) {
					 agendaService.cancelarEdicao();
					 errorCb(agendaService.getDados());
				 });

		 } else {
			 $http.post(Constants.AGENDA, data).then(function successCallback(response) {
				 agendaService.agenda = response.data.agenda;
				 successCb(agendaService.getDados());
			 }, function errorCallback(response) {
				 agendaService.cancelarEdicao();
				 errorCb(agendaService.getDados());
			 });
		 }
	 };

	return agendaService;

});