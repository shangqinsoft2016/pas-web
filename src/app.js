import React  from 'react';
import ReactDOM from 'react-dom';
import TopMenu from './topMenu.js';//topMenu
import AccordionMenu from './accordionMenu.js';//accordionMenu
import ClosableTabs from './addons/closable-tab.js';//accordionMenu
import {Grid,Row,Col} from 'react-bootstrap';
import {SERVER_URL} from './common.js'
class PasApp extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      topMenuID:6,
      leftMenuID:0,
      tabs:[]
    };
  }
  topMenuChange (menuID) {
    this.setState({topMenuID:menuID})
  }
  leftMenuChange (menuID,menuName,compName,props) {
    if(this.state.leftMenuID===menuID) return;
    if(menuID>0&&menuName){
      this.addTab(menuID,menuName,compName,props)
    }
    this.setState({leftMenuID:menuID})
  }
  findIndex(menuID){
    return this.state.tabs.findIndex((val)=>val.id===menuID)
  }
  addTab(menuID,menuName,compName,props){
    let tabs=this.state.tabs
    let ret=this.findIndex(menuID)
    if(this.findIndex(menuID)===-1){
        let tab={id:menuID,name:menuName,comp:compName,props:props}
        tabs.push(tab)
    }
  }
  deleteTab(menuID){
    let tabs=this.state.tabs
    let index=this.findIndex(menuID)
    if(index>=0){
      tabs.splice(index,1)
      let mID=0
      if(index>0) {
        mID=tabs[index-1].id
      }
      this.leftMenuChange(mID)
    }
  }
  render () {
    return(
      <Grid fluid>
        <Row className="show-grid">
          <Col md={12}>
            <TopMenu fetch={{url:SERVER_URL+"/Menu/Menu/0",method:"jsonp"}} 
                     selectChange={this.topMenuChange.bind(this)}/>
          </Col>
          <Col xs={6} md={2}>
            <AccordionMenu fetch={{url:SERVER_URL+"/Menu/Menu/"+this.state.topMenuID,method:"jsonp"}}
                           selectChange={this.leftMenuChange.bind(this)}/>
          </Col>
          <Col xs={6} md={10}>
            <ClosableTabs items={this.state.tabs} activeKey={this.state.leftMenuID} onRemoveTab={this.deleteTab.bind(this)}/>
          </Col>
        </Row>
      </Grid>
    )
  }
}
const mountNode=document.getElementById("default");
ReactDOM.render(<PasApp/>, mountNode);


