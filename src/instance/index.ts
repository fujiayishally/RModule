import {configMixin} from './config';
import {defineMixin} from './define';
import {taskMixin} from './task';
import {getMixin} from './get';

import RModule from './global-api';

configMixin(RModule);
defineMixin(RModule);
taskMixin(RModule);
getMixin(RModule);

export default RModule;