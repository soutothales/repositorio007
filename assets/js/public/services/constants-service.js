angular.module('portal').factory('Constants', function() {

	var constants = {};

	constants.MAIN_URL = 'http://localhost:1337';

	constants.LOGIN_URL = 'http://localhost:1337/login';
	constants.LOGOUT_URL = 'http://localhost:1337/logout';

	constants.USER_URL = 'http://localhost:1337/user';
	constants.USER_AVATAR_URL = 'http://localhost:1337/user/avatar';

	constants.AGENDA_URL = 'http://localhost:1337/agenda';

	constants.SALA_URL =  'http://localhost:1337/sala';

	constants.PROJETO_URL =  'http://localhost:1337/projeto';

	return constants;
});
