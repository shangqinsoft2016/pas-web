webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(37);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _topMenu = __webpack_require__(175);

	var _topMenu2 = _interopRequireDefault(_topMenu);

	var _accordionMenu = __webpack_require__(440);

	var _accordionMenu2 = _interopRequireDefault(_accordionMenu);

	var _main = __webpack_require__(441);

	var _main2 = _interopRequireDefault(_main);

	var _reactBootstrap = __webpack_require__(177);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	//accordionMenu
	var mainGrid = _react2['default'].createElement(_reactBootstrap.Grid, { fluid: 'container-fluid' }, _react2['default'].createElement(_reactBootstrap.Row, { className: 'show-grid' }, _react2['default'].createElement(_reactBootstrap.Col, { md: 12 }, _topMenu2['default']), _react2['default'].createElement(_reactBootstrap.Col, { xs: 6, md: 2 }, _accordionMenu2['default']), _react2['default'].createElement(_reactBootstrap.Col, { xs: 6, md: 10 }, _main2['default']))); //accordionMenu
	//topMenu

	var mountNode = document.getElementById("default");
	_reactDom2['default'].render(mainGrid, mountNode);
	// export default mainGrid

/***/ }
]);