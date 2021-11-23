import san, { defineComponent, Component, ComponentDefineOptions, parseTemplate } from "../index";

import './clicker-def'
import './cmpt-loader'
import './color-picker-ext'
import './datatypes'
import './folder-def-nodata'
import './input-def-noopt'
import './label-ext-static-nodata'

san.evalExpr(san.parseExpr('1+1'), new san.Data());
san.parseTemplate('<div></div>', {trimWhitespace: 'all'});  // Auto Complete
parseTemplate('<div></div>', {trimWhitespace: 'blank'});
