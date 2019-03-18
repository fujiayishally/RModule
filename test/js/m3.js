/**
 * 循环依赖会报错，因为总有一个先定义，另一个未定义
 */

RModule.define('circle1', ['circle2'], function (circle2) {

	function circle1() {
		circle2();
	}

	return circle1;
});

RModule.define('circle2', ['circle1'], function (circle1) {

	function circle2() {
		circle1();
	}

	return circle2;
});