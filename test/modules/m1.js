mimic_require.define(function () {

	function a(id, text) {
		var el = document.getElementById(id);
		el.innerHTML = text;
	}

	return {a: a};
});