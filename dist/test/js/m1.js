RModule.define('m1', function () {

	function getDOM(id, text) {
		var el = document.getElementById(id);
		el.innerHTML = text;
	}

	return {getDOM: getDOM};
});
