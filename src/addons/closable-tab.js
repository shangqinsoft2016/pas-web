import React,{ Component, PropTypes } from 'react';
import {Tabs,Tab,Button,Glyphicon} from 'react-bootstrap';
import Forctory from '../forms/factory.js'
import { deepEqual, hashcode } from '../utils/objects';
import { getAbsoluteLeft, getAbsoluteTop } from '../utils/dom';
import * as Forms from '../forms/index.js';
import reactCSS from 'reactcss'
class ClosableTabs extends React.Component {
  constructor (props) {
    super(props);
    let items = props.items;
    this.state = {
      items:items,
      activeKey:0,
      left:0,
      top:0,
      overKey:0,
      display:false
    };
  }
  handleSelect(key) {
    let actKey=this.state.activeKey
    if (!deepEqual(key, actKey)) {
      this.setState({ activeKey: key});
    }
  }
  handleMouseOver(event) {
    let o=event.target
    let menuID=parseInt(o.id.substring(17))
    let el=o.parentNode
    if(!menuID){
      return
    }
    let top=el.offsetTop+3
    let left=el.offsetLeft+el.offsetWidth-18
    this.setState({left:left,top:top,display:true,overKey:menuID});
  }
  handleMouseOut(event) {
    var reltg = event.relatedTarget ? event.relatedTarget : event.toElement;
    if(reltg&&reltg.id==="closeicon"){
      return
    }
    this.setState({ left:0,top:0,display:false,overKey:0});
  }
  handleRemoveTab (menuID) {
    this.setState({ left:0,top:0,display:false})
    this.props.onRemoveTab(menuID);
  }
  componentWillReceiveProps (nextProps) {
    if (!deepEqual(nextProps.items, this.props.items)) {
      this.setState({ items: nextProps.items});
    }
    if (!deepEqual(nextProps.activeKey, this.props.activeKey)) {
      this.setState({ activeKey: nextProps.activeKey});
    }
  }
  renderChildren (children, index) {
    let newChildren = Children.toArray(children).map((child, i) => {
      if (typeof child === 'string') {
        return <span key={i}>{child}</span>;
      }
      let props = {};
      if (child.props && child.props.children === 'object') {
        props.children = this.renderChildren(child.props.children, i);
      }
      
      child = cloneElement(child, props);
      return child;
    });
    return newChildren;
  }
  render () {
    let result = [];
    let f=new Forctory()
    for (let val of this.state.items) {
      let render=f.get(val.comp)
      result.push(
        <Tab eventKey={val.id} key={val.id} title={val.name}>{render(val.props)}</Tab>
      );
    }
    return (
      <Tabs activeKey={this.state.activeKey} onSelect={this.handleSelect.bind(this)} onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)} id="pas-tab-list">
	  	  {result}
        <CloseImg display={this.state.display} left={this.state.left} top={this.state.top} menuID={this.state.overKey} onRemoveTab={this.handleRemoveTab.bind(this)}/>
      </Tabs>
    );
  }
}

ClosableTabs.propTypes = {
  activeKey:PropTypes.number,
  items: PropTypes.array,
  onRemoveTab:PropTypes.func
};

ClosableTabs.defaultProps = {
  activeKey:0,
  items: [],
  onRemoveTab: (id)=>{}
};

export default ClosableTabs

class CloseImg extends React.Component {
  constructor (props) {
    super(props);
    const { left, top, display } = this.props;
    this.state = {
      left:left,
      top:top,
      display:display
    };
  }
  componentWillReceiveProps (nextProps) {
    if (!deepEqual(nextProps.left, this.props.left)) {
      this.setState({ left: nextProps.left});
    }
    if (!deepEqual(nextProps.top, this.props.top)) {
      this.setState({ top: nextProps.top});
    }
    if (!deepEqual(nextProps.display, this.props.display)) {
      this.setState({ display: nextProps.display});
    }
  }
  handleRemoveTab () {
    let menuID = this.props.menuID;
    this.props.onRemoveTab(menuID);
  }
  render () {
     const styles = reactCSS({
      'default': {
        card: {
          position:"absolute",
          left:0,
          top:0,
          display:"none"
        }
      },
      'display': {
        card: {
          position:"absolute",
          left:this.state.left,
          top:this.state.top,
          display:"block",
          cursor:"pointer"
        }
      }
    },this.props,this.state)
    return (
      <Glyphicon id="closeicon" glyph="remove" style={styles.card} onClick={this.handleRemoveTab.bind(this)}/>
    );
  }
}
CloseImg.propTypes = {
  left:PropTypes.number,
  top:PropTypes.number,
  display:PropTypes.bool,
  menuID:PropTypes.number,
  onRemoveTab:PropTypes.func
};
CloseImg.defaultProps = {
  left:0,
  top:0,
  display:false,
  menuID:0,
  onRemoveTab: (id)=>{}
};
