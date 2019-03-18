function RModule() {
	this.$origin = _GOrigin;
	this.$base = '';
	this.$alias = {};
	this.$modules = _GModules;
}

configMixin(RModule);
defineMixin(RModule);
getMixin(RModule);
taskMixin(RModule);

