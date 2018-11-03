angular.module('portal').factory('Constants', function() {
    var constants = {};

    // Heroku
    // constants.LOGIN_URL = 'http://asus-cap.herokuapp.com/login';
	// constants.LOGOUT = 'http://asus-cap.herokuapp.com/logout';
	// constants.USER = 'http://asus-cap.herokuapp.com/user';
	// constants.AGENDA = 'http://asus-cap.herokuapp.com/agenda';
	// constants.AVATAR = 'http://asus-cap.herokuapp.com/user/avatar';

    /* ***** ----- Mudar de acordo com seu ipv4 (ipconfig no cmd) ----- ***** */

    // Anderson
    constants.LOGIN_URL = 'http://192.168.130.49:1337/login';
    constants.LOGOUT = 'http://192.168.130.49:1337/logout';
	constants.USER = 'http://192.168.130.49:1337/user';
	constants.AGENDA = 'http://192.168.130.49:1337/agenda';
	constants.AVATAR = 'http://192.168.130.49:1337/user/avatar';

    // Breno
    //  constants.LOGIN_URL = 'http://192.168.130.45:1337/login';
    //  constants.LOGOUT = 'http://192.168.130.45:1337/logout';
    //  constants.USER = 'http://192.168.130.45:1337/user';
	//  constants.AGENDA = 'http://192.168.130.45:1337/agenda

    // Thales

    return constants;
});
