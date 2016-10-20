import React from 'react';
import ReactDOM from 'react-dom';
import topMenu from './topMenu.js';//topMenu
import accordionMenu from './accordionMenu.js';//accordionMenu
import PaginationAdvanced from './main.js';//accordionMenu
import {Grid, Row, Col, Image, Form, FormGroup, FormControl, Button, Checkbox, ControlLabel} from 'react-bootstrap';

const FormExample = React.createClass({
  getInitialState() {
    return {
      value: ''
    };
  },
  getValidationState() {
    const length = this.state.value.length;
    if (length > 6) return 'success';
    else if (length > 0) return 'error';
  },
  handleChange(e) {
    this.setState({ value: e.target.value });
  },
  render() {
    return (
      <Form horizontal action="./default.html">
        <FormGroup controlId="formHorizontalEmail"  validationState={this.getValidationState() } >
          <Col componentClass={ControlLabel} sm={2}>
            <font className="lab">工 号</font>
          </Col>
          <Col sm={2}>
            <FormControl type="text" placeholder="Job Number" onChange={this.handleChange}/>
            <FormControl.Feedback />
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalPassword">
          <Col componentClass={ControlLabel} sm={2}>
            <font className="lab">密 码</font>
          </Col>
          <Col sm={2}>
            <FormControl type="password" placeholder="Password"/>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button type="submit"  bsStyle="primary">登陆</Button>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <Button type="submit" bsStyle="info">重置</Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
});
const formInstance =(< FormExample/>);

const gridInstance = (
  <Grid fluid='container-fluid'>
    <Row className="show-grid">
      <Col md={12} id="login-logo"><Image src="img/login-logo.png"/></Col>
      <Col md={12} id="logo"><Image src="img/bg.jpg"/></Col>
      <Col md={12} id="from-logo">{formInstance}</Col>
    </Row>
  </Grid>
);

// const mainGrid = (
//   <Grid fluid='container-fluid'>
//     <Row className="show-grid">
//       <Col md={12}>{topMenu}</Col>
//       <Col xs={6} md={2}>{accordionMenu}</Col>
//       <Col xs={6} md={10}>{PaginationAdvanced}</Col>
//     </Row>
//   </Grid>
// );

const mountNode = document.getElementById("app");
ReactDOM.render(gridInstance, mountNode);
