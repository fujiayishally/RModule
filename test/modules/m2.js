mimic_require.define(function () {

	var m1 = mimic_require('test/modules/m1.js');

	var b = m1.a;

	return {b: b};
});