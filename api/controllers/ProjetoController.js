/**
 * projetoController
 *
 * @description :: Server-side logic for managing projetos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
		//sails.log.debug("User ativo: " + req.userAtivo.id);
		// Usuario que enviou o request
		userAtivo = req.userAtivo;

		if(req.body.nome == undefined || !req.body.nome.trim()){
			return res.json(400, {err: 'Campo nome é necessário.'});
		}

		Projeto.create({nome: req.body.nome}).exec(function(err, projetoCriado){
			if(err){
				if(err.invalidAttributes && err.invalidAttributes.nome &&
					err.invalidAttributes.nome[0] &&
					err.invalidAttributes.nome[0].rule === 'unique'){
						return res.json(409, {err: 'Este nome já está em uso por outro projeto.'});
					}
				return res.json(err.status, {err: err});
			}

			if(projetoCriado){
				sails.log.debug("projeto Criado. nome: " + projetoCriado.nome);
				return res.json(200, {projeto: projetoCriado});
			}
		});
	},

	update: function(req, res) {
		id = req.param('id');

		if(req.body.nome == undefined || !req.body.nome.trim()){
			return res.json(400, {err: 'Nenhum parâmetro foi passado corretamente.'});
		}

		Projeto.update({id: id}, {nome: req.body.nome.trim()})
		.exec(function(err, projetoAtualizado){
			if(err){
        if(err.invalidAttributes && err.invalidAttributes.nome &&
          err.invalidAttributes.nome[0] && err.invalidAttributes.nome[0].rule === 'unique'){
          return res.json(409, {err: 'Este nome já está em uso por outro projeto.'});
        }
				return res.json(500, {err: 'Erro ao atualizar dados do projeto.'});
			}
			// Atualizou com sucesso
			if(projetoAtualizado[0]){
				sails.log.debug("projeto atualizada. nome: " + projetoAtualizado[0].nome);
				return res.json(200, {projeto: projetoAtualizado[0]});
			// Se usuário não existe?
			} else {
				return res.json(404, {err: 'projeto não encontrado.'});
			}
		});
	},

	findOne: function(req, res){
		Projeto.findOne({id: req.param('id')})
		.populate('users')
		.exec(function(err, projetoEncontrado){
			if(err){
				return res.json(500, {err: 'Erro ao recuperar o projeto no banco de dados.'});
			}
			// Não encontrou projeto
			if(!projetoEncontrado) return res.json(404, {err: 'Projeto não encontrado.'});
			// projeto encontrado
			return res.json(200, {projeto: projetoEncontrado});
		});
	},

	addUser: function(req, res){
		Projeto.findOne({id: req.param('id')})
		.exec(function(err, projetoEncontrado){
			if(err){
				return res.json(500, {err: 'Erro ao recuperar o projeto no banco de dados.'});
			}
			// Não encontrou projeto
			if(!projetoEncontrado) return res.json(404, {err: 'Projeto não encontrado.'});

			// projeto encontrado, procura usuário
			User.findOne({id: req.param('userId')}).exec(function(err, userEncontrado){
				if(err){
					return res.json(500, {err: 'Erro ao recuperar usuário no banco de dados.'});
				}
				// Não encontrou o usuário
				if(!userEncontrado) return res.json(404, {err: 'Usuário não encontrado.'});

				// Se usuário já está em uma projeto
				if(userEncontrado.projeto){
					return res.json(400, {err: 'Usuário já está em um projeto.'});
				}

        // Encontrou o usuário

        // Usuário é coach
        if(userEncontrado.nivel === User.Niveis.COACH){
          projetoEncontrado.coaches.add(userEncontrado.id);
        }
				projetoEncontrado.users.add(userEncontrado.id);
				projetoEncontrado.save(function(err){
					if(err) return res.json(500, {err: 'Erro ao cadastrar usuário no projeto.'});

					Projeto.findOne({id: req.param('id')})
					.populate('users')
					.exec(function(err, projetoEncontrado){
						if(err){
							return res.json(500, {err: 'Erro ao recuperar a projeto no banco de dados.'});
						}
						// Não encontrou projeto
						if(!projetoEncontrado) return res.json(404, {err: 'Projeto não encontrado.'});

						return res.json(200, {projeto: projetoEncontrado});
					});
				});
			});
		});
	},

	removeUser: function(req, res){
		// Se não passou id do usuário a ser removido
		if(req.param('userId') == undefined) return res.json(400, {err: 'Id do usuário não foi passado.'});

		Projeto.findOne({id: req.param('id')})
		.exec(function(err, projetoEncontrado){
			if(err){
				return res.json(500, {err: 'Erro ao recuperar a projeto no banco de dados.'});
			}
			// Não encontrou projeto
			if(!projetoEncontrado) return res.json(404, {err: 'Projeto não encontrado.'});

			// Encontrou o usuário

      // Usuário é coach
      projetoEncontrado.coaches.remove(req.param('userId'));
			projetoEncontrado.users.remove(req.param('userId'));
			projetoEncontrado.save(function(err){

        if(err) return res.json(500, {err: 'Erro ao remover usuário do projeto.'});

        Projeto.findOne({id: req.param('id')})
        .populate('users')
        .populate('coaches')
        .exec(function(err, projetoEncontrado){
          if(err){
            return res.json(500, {err: 'Erro ao recuperar o projeto no banco de dados.'});
          }
          // Não encontrou projeto
          if(!projetoEncontrado) return res.json(404, {err: 'Projeto não encontrado.'});

          return res.json(200, {projeto: projetoEncontrado});
        });
			});
		});
	}

};
