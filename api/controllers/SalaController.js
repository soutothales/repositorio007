/**
 * SalaController
 *
 * @description :: Server-side logic for managing salas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
		//sails.log.debug("User ativo: " + req.userAtivo.id);
		// Usuario que enviou o request
		userAtivo = req.userAtivo;

		if(req.body.localizacao == undefined || !req.body.localizacao.trim()){
			return res.json(400, {err: 'Campo localizacao é necessário.'});
		}

		Sala.create({localizacao: req.body.localizacao}).exec(function(err, salaCriada){
			if(err){
				if(err.invalidAttributes && err.invalidAttributes.localizacao &&
					err.invalidAttributes.localizacao[0] &&
					err.invalidAttributes.localizacao[0].rule === 'unique'){
						return res.json(409, {err: 'Esta localizacao já está em uso por outra sala.'});
					}
				return res.json(err.status, {err: err});
			}

			if(salaCriada){
				sails.log.debug("Sala criada. localizacao: " + salaCriada.localizacao);
				return res.json(200, {sala: salaCriada});
			}
		});
	},

	update: function(req, res) {
		id = req.param('id');

		if(req.body.localizacao == undefined || !req.body.localizacao.trim()){
			return res.json(400, {err: 'Nenhum parâmetro foi passado corretamente.'});
		}

		Sala.update({id: id}, {localizacao: req.body.localizacao.trim()})
		.exec(function(err, salaAtualizada){
			if(err){
        if(err.invalidAttributes && err.invalidAttributes.localizacao &&
          err.invalidAttributes.localizacao[0] && err.invalidAttributes.localizacao[0].rule === 'unique'){
          return res.json(409, {err: 'Esta localizacao já está em uso por outra sala.'});
        }

				return res.json(500, {err: 'Erro ao atualizar dados da sala.'});
			}
			// Atualizou com sucesso
			if(salaAtualizada[0]){
				sails.log.debug("Sala atualizada. Localizacao: " + salaAtualizada[0].localizacao);
				return res.json(200, {sala: salaAtualizada[0]});
			// Se usuário não existe?
			} else {
				return res.json(404, {err: 'Sala não encontrada.'});
			}
		});
	},

	findOne: function(req, res){
		Sala.findOne({id: req.param('id')})
		.populate('users')
		.exec(function(err, salaEncontrada){
			if(err){
				return res.json(500, {err: 'Erro ao recuperar a sala no banco de dados.'});
			}
			// Não encontrou sala
			if(!salaEncontrada) return res.json(404, {err: 'Sala não encontrada.'});
			// Sala encontrada
			return res.json(200, {sala: salaEncontrada});
		});
	},

	addUser: function(req, res){
		Sala.findOne({id: req.param('id')})
		.exec(function(err, salaEncontrada){
			if(err){
				return res.json(500, {err: 'Erro ao recuperar a sala no banco de dados.'});
			}
			// Não encontrou sala
			if(!salaEncontrada) return res.json(404, {err: 'Sala não encontrada.'});

			// Sala encontrada, procura usuário
			User.findOne({id: req.param('userId')}).exec(function(err, userEncontrado){
				if(err){
					return res.json(500, {err: 'Erro ao recuperar usuário no banco de dados.'});
				}
				// Não encontrou o usuário
				if(!userEncontrado) return res.json(404, {err: 'Usuário não encontrado.'});

				// Se usuário já está em uma sala
				if(userEncontrado.sala){
					return res.json(400, {err: 'Usuário já está em uma sala.'});
				}
				// Encontrou o usuário
				salaEncontrada.users.add(userEncontrado.id);
				salaEncontrada.save(function(err){
					if(err) return res.json(500, {err: 'Erro ao cadastrar usuário na sala.'});

					Sala.findOne({id: req.param('id')})
					.populate('users')
					.exec(function(err, salaEncontrada){
						if(err){
							return res.json(500, {err: 'Erro ao recuperar a sala no banco de dados.'});
						}
						// Não encontrou sala
						if(!salaEncontrada) return res.json(404, {err: 'Sala não encontrada.'});

						return res.json(200, {sala: salaEncontrada});
					});
				});
			});
		});
	},

	removeUser: function(req, res){
		// Se não passou id do usuário a ser removido
		if(req.param('userId') == undefined) return res.json(400, {err: 'Id do usuário não foi passado.'});

		Sala.findOne({id: req.param('id')})
		.exec(function(err, salaEncontrada){
			if(err){
				return res.json(500, {err: 'Erro ao recuperar a sala no banco de dados.'});
			}
			// Não encontrou sala
			if(!salaEncontrada) return res.json(404, {err: 'Sala não encontrada.'});

			// Encontrou o usuário
			salaEncontrada.users.remove(req.param('userId'));
			salaEncontrada.save(function(err){
				if(err) return res.json(500, {err: 'Erro ao remover usuário da sala.'});

        Sala.findOne({id: req.param('id')})
        .populate('users')
        .exec(function(err, salaEncontrada){
          if(err){
            return res.json(500, {err: 'Erro ao recuperar a sala no banco de dados.'});
          }
          // Não encontrou sala
          if(!salaEncontrada) return res.json(404, {err: 'Sala não encontrada.'});

          return res.json(200, {sala: salaEncontrada});
        });
			});
		});
	}

};
