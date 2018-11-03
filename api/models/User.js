/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcryptjs');

const Niveis = {
  ADMIN: 'admin',
  GERENTE: 'gerente',
  COACH: 'coach',
  ALUNO: 'aluno'
};

const defaultAvatar = 'https://res.cloudinary.com/asales/image/upload/v1487338403/profile_placeholder-3242dfe5bfcf57f3284beff4421e8b1e_ku7537.png';

module.exports = {

  Niveis: {
    ADMIN: 'admin',
    GERENTE: 'gerente',
    COACH: 'coach',
    ALUNO: 'aluno'
  },

  schema: true,

  attributes: {
    nome: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 30
    },

    login: {
      type: 'string',
      required: true,
      unique: true,
      minLength: 5,
      maxLength: 15
    },

    email: {
      type: 'string',
      unique: true,
      email: true
    },

    avatarUrl: {
      type: 'string',
      defaultsTo: defaultAvatar
    },

    senhaEncriptada: {
      type: 'string',
    },

    nivel: {
      type: 'string',
      required: true,
      defaultsTo: 'aluno',
      // O valor desse atributo deve estar entre os valores de Niveis
      enum: ['admin', 'gerente', 'coach', 'aluno']
    },

    projeto: {
      model: 'projeto'
    },

    // id do usuario que o criou
    criadoPor: {
      model: 'user',
      required: true
    },

    descricao: {
      type: 'string',
      defaultsTo: ''
    },

    competencias: {
      type: 'array',
      defaultsTo: [],
    },

    sala: {
      model: 'sala'
    },

    agenda: {
      model: 'agenda',
    },

    tokens: {
      type: 'array',
      defaultsTo: []
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.senhaEncriptada;
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.criadoPor;
      delete obj.tokens;
      return obj;
    }
  },

  beforeCreate: function(values, next) {
    // Se não passou competencias, cria um array vazio
    if(values.competencias != undefined){
      // Verifica que todos as competencias passadas sao validas
      for (var i = values.competencias.length - 1; i >= 0; i--) {
        values.competencias[i] = values.competencias[i].trim();
        if ((values.competencias[i].split(',').length > 1 && values.competencias[i].split(',')[0].trim().length == 0) ||
          values.competencias[i].trim().length < 1) {
          values.competencias.splice(i, 1);
        } else {
          values.competencias[i] = values.competencias[i].split(',')[0].trim();
        }
      }

      // Verifica se existem competencias duplicadas
      for (var i = values.competencias.length - 1; i >= 0; i--) {
        var jaExiste = false;

        for (var j = values.competencias.length - 1; j >= 0; j--) {
          if(values.competencias[i] === values.competencias[j] && jaExiste){
            values.competencias.splice(i,1);
            break;
          } else if(values.competencias[i] === values.competencias[j] && !jaExiste) {
            jaExiste = true;
          }
        }
      }
    } else {
      values.competencias = [];
    }

    // Encripta a senha antes de criar o usuário
    bcrypt.genSalt(10, function(err, salt){
      if(err) return next(err);
      bcrypt.hash(values.senha, salt, function(err, hash){
        if(err) return next(err);
        values.senhaEncriptada = hash;
        next();
      })
    })
  },

  beforeUpdate: function(values, next) {
    if(values.competencias != undefined){
      // Verifica que todos as competencias passadas sao validas
      for (var i = values.competencias.length - 1; i >= 0; i--) {
        values.competencias[i] = values.competencias[i].trim();
        if ((values.competencias[i].split(',').length > 1 && values.competencias[i].split(',')[0].trim().length == 0) ||
          values.competencias[i].trim().length < 1) {
          values.competencias.splice(i, 1);
        } else {
          values.competencias[i] = values.competencias[i].split(',')[0].trim();
        }
      }
      // Verifica se existem competencias duplicadas
      for (var i = values.competencias.length - 1; i >= 0; i--) {
        var jaExiste = false;

        for (var j = values.competencias.length - 1; j >= 0; j--) {
          if(values.competencias[i] === values.competencias[j] && jaExiste){
            values.competencias.splice(i,1);
            break;
          } else if(values.competencias[i] === values.competencias[j] && !jaExiste) {
            jaExiste = true;
          }
        }
      }
    }

    // Encripta a senha antes de atualizar a existente
    if(values.novaSenha){
      bcrypt.genSalt(10, function(err, salt){
        if(err) return next(err);
        bcrypt.hash(values.novaSenha, salt, function(err, hash){
          if(err) return next(err);
          values.senhaEncriptada = hash;
          next();
        });
      });
    } else {
      next();
    }
  },

  // TODO: afterUpdate: Se alterar a senha, invalidar tokens do usuários

  compararSenha: function(senha, user, cb) {
    bcrypt.compare(senha, user.senhaEncriptada, function(err, match){
      if(err) {
        cb(err);
        return;
      }

      if(match){
        cb(null, true);
      } else {
        cb(err);
      }
    })
  },

  // Retorna true se o nivel é válido
  verificarNivel: function(nivel){
    for(var i in Niveis){
      if (Niveis[i] === nivel) return true;
    }

    return false;
  }

};
