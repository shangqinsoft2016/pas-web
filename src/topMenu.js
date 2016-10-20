import React,{ Component, PropTypes } from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Image} from 'react-bootstrap';
import { fetchEnhance, FETCH_SUCCESS } from './higherOrders/Fetch';
import { getLang } from './lang';
import { deepEqual, hashcode } from './utils/objects';
class TopMenu extends React.Component {
  constructor (props) {
    super(props);
    let data = props.data;
    this.state = {
      data
    };
  }
  onSelectChange (key,event) {
    var menuID = key;
    this.props.selectChange(menuID);
  }
  componentWillReceiveProps (nextProps) {
    if (!deepEqual(nextProps.selectChange, this.props.selectChange)) {
      this.setState({ selectChange: nextProps.selectChange});
    }
    if (!deepEqual(nextProps.data, this.props.data)) {
      this.setState({ data: nextProps.data});
    }
  }
  render () {
    let { pullLeft,dataListTpl,fetchStatus,selectChange } = this.props;
    let result = [];
    if (fetchStatus !== FETCH_SUCCESS) {
      return <Nav pullLeft={pullLeft} pullRight={!pullLeft}><NavItem>{getLang('fetch.status')[fetchStatus]}</NavItem></Nav>;
    }
    if (!this.state.data||!this.state.data[dataListTpl]){
      return <Nav pullLeft={pullLeft} pullRight={!pullLeft}><NavItem>"返回的数据格式非法"</NavItem></Nav>;  
    }
    let options = this.state.data[dataListTpl].map((d, i) => {
      result.push(
            <NavItem eventKey={d.ID} key={d.ID}>{d.Name}</NavItem >
      );
    });
    return (
      <Navbar inverse fluid>
        <Navbar.Header >
          <Navbar.Header>
            <Image src="img/logo.png" />
            <Navbar.Toggle />
          </Navbar.Header>
        </Navbar.Header>
        <Navbar.Collapse>
        <Nav pullLeft={pullLeft} pullRight={!pullLeft} onSelect={this.onSelectChange.bind(this)}>{result}</Nav>
        <Nav pullRight>
            <NavItem>欢迎您，分行公共！</NavItem>
            <NavItem>首页</NavItem>
            <NavItem href="./index.html">注销</NavItem>
        </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

TopMenu.propTypes = {
  data: PropTypes.object,
  pullLeft: PropTypes.bool,
  dataListTpl:PropTypes.string,
  dataCountTpl:PropTypes.string,
  selectChange:PropTypes.func
};

TopMenu.defaultProps = {
  pullLeft: true,
  data: {},
  dataListTpl: 'Objectlist',
  dataCountTpl: 'Count',
  selectChange: (id)=>{}
};

TopMenu = fetchEnhance(TopMenu);
export default TopMenu
