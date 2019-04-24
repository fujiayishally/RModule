RModule.define('m2', ['m1'], function (m1) {

	function add(x, y) {
		return x + y;
	}

	function writeAdd(id, x, y) {
		m1.getDOM(id, add(x, y));
	}

	function writeAdd2(id, x, y) {
		var getDOM = RModule.get('util').getDOM;
		getDOM(id, add(x, y));
	}

	return {
		add: add,
		writeAdd: writeAdd,
		writeAdd2: writeAdd2
	};
});