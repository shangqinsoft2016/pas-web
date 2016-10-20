webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(442);


/***/ },

/***/ 442:
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
	var FormExample = _react2['default'].createClass({
	  displayName: 'FormExample',
	  getInitialState: function getInitialState() {
	    return {
	      value: ''
	    };
	  },
	  getValidationState: function getValidationState() {
	    var length = this.state.value.length;
	    if (length > 6) return 'success';else if (length > 0) return 'error';
	  },
	  handleChange: function handleChange(e) {
	    this.setState({ value: e.target.value });
	  },
	  render: function render() {
	    return _react2['default'].createElement(_reactBootstrap.Form, { horizontal: true, action: './default.html' }, _react2['default'].createElement(_reactBootstrap.FormGroup, { controlId: 'formHorizontalEmail', validationState: this.getValidationState() }, _react2['default'].createElement(_reactBootstrap.Col, { componentClass: _reactBootstrap.ControlLabel, sm: 2 }, _react2['default'].createElement('font', { className: 'lab' }, '工 号')), _react2['default'].createElement(_reactBootstrap.Col, { sm: 2 }, _react2['default'].createElement(_reactBootstrap.FormControl, { type: 'text', placeholder: 'Job Number', onChange: this.handleChange }), _react2['default'].createElement(_reactBootstrap.FormControl.Feedback, null))), _react2['default'].createElement(_reactBootstrap.FormGroup, { controlId: 'formHorizontalPassword' }, _react2['default'].createElement(_reactBootstrap.Col, { componentClass: _reactBootstrap.ControlLabel, sm: 2 }, _react2['default'].createElement('font', { className: 'lab' }, '密 码')), _react2['default'].createElement(_reactBootstrap.Col, { sm: 2 }, _react2['default'].createElement(_reactBootstrap.FormControl, { type: 'password', placeholder: 'Password' }))), _react2['default'].createElement(_reactBootstrap.FormGroup, null, _react2['default'].createElement(_reactBootstrap.Col, { smOffset: 2, sm: 10 }, _react2['default'].createElement(_reactBootstrap.Button, { type: 'submit', bsStyle: 'primary' }, '登陆'), '                     ', _react2['default'].createElement(_reactBootstrap.Button, { type: 'submit', bsStyle: 'info' }, '重置'))));
	  }
	}); //accordionMenu
	//topMenu

	var formInstance = _react2['default'].createElement(FormExample, null);

	var gridInstance = _react2['default'].createElement(_reactBootstrap.Grid, { fluid: 'container-fluid' }, _react2['default'].createElement(_reactBootstrap.Row, { className: 'show-grid' }, _react2['default'].createElement(_reactBootstrap.Col, { md: 12, id: 'login-logo' }, _react2['default'].createElement(_reactBootstrap.Image, { src: 'img/login-logo.png' })), _react2['default'].createElement(_reactBootstrap.Col, { md: 12, id: 'logo' }, _react2['default'].createElement(_reactBootstrap.Image, { src: 'img/bg.jpg' })), _react2['default'].createElement(_reactBootstrap.Col, { md: 12, id: 'from-logo' }, formInstance)));

	// const mainGrid = (
	//   <Grid fluid='container-fluid'>
	//     <Row className="show-grid">
	//       <Col md={12}>{topMenu}</Col>
	//       <Col xs={6} md={2}>{accordionMenu}</Col>
	//       <Col xs={6} md={10}>{PaginationAdvanced}</Col>
	//     </Row>
	//   </Grid>
	// );

	var mountNode = document.getElementById("app");
	_reactDom2['default'].render(gridInstance, mountNode);

/***/ }

});