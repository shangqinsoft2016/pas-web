import React,{ Component, PropTypes } from 'react';
import Forctory from './factory.js'
import { deepEqual, hashcode } from '../utils/objects';
class FormTest extends React.Component {
  constructor (props) {
    super(props);
    let content = props.content;
    this.state = {
      content:content
    };
  }
  componentWillReceiveProps (nextProps) {
    if (!deepEqual(nextProps.content, this.props.content)) {
      this.setState({ content: nextProps.content});
    }
  }
  render () {
    return (
      <div>{this.state.content}</div>
    );
  }
}
FormTest.propTypes = {
  content:PropTypes.string
};
FormTest.defaultProps = {
  content:""
};
export default FormTest
let render=(props)=>React.createElement(FormTest, props);
let f = new Forctory()
f.set("FormTest",render)
