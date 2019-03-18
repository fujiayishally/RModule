RModule.define('multiply10', ['add10'], function (add10) {

	function multiply10(id, num) {
		add10(id, num * 10);
	}

	return multiply10;
});