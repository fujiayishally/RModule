RModule.define('num', function () {

	function test(id, num) {
		var el = document.getElementById(id);
		el.innerHTML = num;
	}

	return {test: test};
});

RModule.define('add10', ['num'], function (init) {

	function add10(id, num) {
		init.test(id, num + 10);
	}
	return add10;
});