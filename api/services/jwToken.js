/**
 * jwToken
 *
 * @description :: JSON Webtoken Service for sails
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */

var jwt = require('jsonwebtoken'),
    tokenSecret = "capacitacaoasus";

// Gera um token a partir do payload
module.exports.issue = function(payload) {
  return jwt.sign(
    payload,
    tokenSecret, // Token secret usado pra assinar do lado do server
    // options
    {
      expiresIn: "30d" // Tempo para o token expirar
    }
  );
};

// Verifica o token no request
module.exports.verify = function(token, callback) {
  return jwt.verify(
    token, // O token a ser verificado
    tokenSecret, // Mesmo token usado pra assinar
    {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    callback //Repassa erros pro callback ou o token decodificado
  );
};
