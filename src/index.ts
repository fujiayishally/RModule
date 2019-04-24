import './share/polyfill';
import RModule from './instance/index';

(function (global, factory) {
    (global ? (global.RModule = factory()) : {});
})(window ? window : this, function () {
    return new RModule();
});

