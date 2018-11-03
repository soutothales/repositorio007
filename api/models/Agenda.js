/**
 * Agenda.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  DIAS: 6,

  attributes: {
    horarios: {
      type: 'array',
      defaultsTo: [[],[],[],[],[],[]]
    },

    user: {
      required: true,
      model: 'user',
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      return obj;
    }
  },

  beforeCreate: function(values, next) {
    var err = {
      code: 'E_UNIQUE',
      invalidAttributes: {horarios: [{rule: 'invalid'}]},
      status: 400,
      message: "Todos os horários devem ser números inteiros."
    };

    for (var i = 0; i < values.horarios.length; i++) {
      for (var j = 0; j < values.horarios[i].length; j++) {
        if(!Number.isInteger(values.horarios[i][j]) || values.horarios[i][j] < 7
            || values.horarios[i][j] > 20){
          return next(err);
        }
      }
    }
    next();
  },

  beforeUpdate: function(values, next) {
    var err = {
      code: 'E_UNIQUE',
      invalidAttributes: {horarios: [{rule: 'invalid'}]},
      status: 400,
      message: "Todos os horários devem ser números inteiros."
    };

    for (var i = 0; i < values.horarios.length; i++) {
      for (var j = 0; j < values.horarios[i].length; j++) {
        if(!Number.isInteger(values.horarios[i][j]) || values.horarios[i][j] < 7
            || values.horarios[i][j] > 20){
          return next(err);
        }
      }
    }
    next();
  },

  afterCreate: function(values, next) {
    // Adiciona a agenda ao usuário associado
    if(values.user)
      return User.update({id: values.user}, {agenda: values.id}).exec(next);
    next();
  }

};
