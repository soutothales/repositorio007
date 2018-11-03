/**
 * AgendaController
 *
 * @description :: Server-side logic for managing agenda
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
		//sails.log.debug("User ativo: " + req.userAtivo.id);
		// Usuario que enviou o request
		userAtivo = req.userAtivo;

		// Se usuário já possui agenda
		if(userAtivo.agenda){
			return res.json(409, {err: 'Este usuário já possui uma agenda.'});
		}
		if(!req.body.horarios){
			return res.json(400, {err: 'É necessário passar pelo menos um horário.'});
		}
		// Se o array passado não tiver todos os dias
		if(req.body.horarios.length != Agenda.DIAS){
			return res.json(400, {err: 'O horário deve conter ' + Agenda.DIAS + ' dias.'});
		}

		Agenda.create({
			horarios: req.body.horarios,
			user: userAtivo.id,
		})
		.populate('user')
		.exec(function(err, agendaCriada){
			// Erro
			if(err){
				// Se o formato dos horarios não são adequados
				if (err.status === 400) {
					return res.json(400, {err: err.message});
				} else {
					return res.json(500, {err: 'Erro ao cadastrar agenda no banco de dados.'});
				}
			}
			// Sucesso
			if(agendaCriada){
				return res.json(200, {agenda: agendaCriada});
			}
		});
	},

	update: function(req, res) {
		idPassado = req.param('id');

		if(!req.body.horarios){
			return res.json(400, {err: 'É necessário passar pelo menos um horário.'});
		}
		// Se o array passado não tiver todos os dias
		if(req.body.horarios.length != Agenda.DIAS){
			return res.json(400, {err: 'O horário deve conter ' + Agenda.DIAS + ' dias.'});
		}

		Agenda.update({id: idPassado, user: req.userAtivo.id}, {horarios: req.body.horarios}).exec(function(err, agendaAtualizada){
			if(err){
				if (err.status === 400) {
					return res.json(400, {err: err.message});
				} else {
					return res.json(500, {err: 'Erro ao atualizar agenda no banco de dados.'});
				}
			}

			if(agendaAtualizada[0]){
				sails.log.debug("Agenda atualizada: " + agendaAtualizada[0].horarios);
				return res.json(200, {agenda: agendaAtualizada[0]});
			} else {
				return res.json(403, {err: 'Você não tem permissão para editar esta agenda ou esta agenda não existe.'});
			}
		});
	},

	find: function(req, res) {
		var idSala;
		if(req.param('sala') != undefined && req.param('sala').trim())
			idSala = req.param('sala').trim();

		// Se não passou id da sala
		if(!idSala){
			Agenda.find({})
			.populate('user')
			.exec(function(err, agendas){
				if(err){
					return res.json(500, {err: 'Erro ao recuperar as agendas no banco de dados.'});
				}
				// Se achou agendas
				if(agendas){
					return res.json(200, {agendas: agendas});
				} else {
					return res.json(404, {err: 'Nenhuma agenda encontrada.'});
				}
			});
		} else {
			Agenda.find({sala: idSala})
			.populate('user')
			.exec(function(err, agendas){
				if(err){
					return res.json(500, {err: 'Erro ao recuperar as agendas no banco de dados.'});
				}
				// Se achou agendas
				if(agendas[0]){
					return res.json(200, {agendas: agendas});
				} else {
					return res.json(404, {err: 'Nenhuma agenda encontrada nesta sala ou esta sala não existe.'});
				}
			});
		}

	}
};
