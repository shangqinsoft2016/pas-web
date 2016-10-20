import React,{ Component, PropTypes } from 'react';
import {Accordion,Panel,ListGroup,ListGroupItem} from 'react-bootstrap';
import { fetchEnhance, FETCH_SUCCESS } from './higherOrders/Fetch';
import { getLang } from './lang';
import { deepEqual, hashcode } from './utils/objects';
import {SERVER_URL} from './common.js'
class AccordionMenu extends React.Component {
  constructor (props) {
    super(props);
    let data = props.data;
    this.state = {
      data
    };
  }
  componentWillReceiveProps (nextProps) {
    if (!deepEqual(nextProps.parentId, this.props.parentId)) {
      this.setState({ data: nextProps.parentId});
    }
    if (!deepEqual(nextProps.data, this.props.data)) {
      this.setState({ data: nextProps.data});
    }
  }
  render () {
    let { parentId,bsStyle,dataListTpl,fetchStatus } = this.props;
    let result = [];
    if (fetchStatus !== FETCH_SUCCESS) {
      return <div>{getLang('fetch.status')[fetchStatus]}</div>;
    }
    if (!this.state.data||!this.state.data[dataListTpl]){
      return <div>"返回的数据格式非法</div>; 
    }
    let firstID;
    this.state.data[dataListTpl].map((d, i) => {
      if (i===0){firstID=d.ID}
      let surl=SERVER_URL+"/Menu/Menu/"+d.ID;
      result.push(
             <Panel header={d.Name} eventKey={d.ID} key={d.ID} bsStyle={bsStyle}>
                <ListMenu fill fetch={{url:surl,method:"jsonp"}} selectChange={this.props.selectChange}/>
             </Panel>
      );
    });
    return <Accordion defaultActiveKey={firstID} key={parentId}>{result}</Accordion>;
  }
}

AccordionMenu.propTypes = {
  parentId:PropTypes.number,
  data: PropTypes.object,
  bsStyle:PropTypes.string,
  dataListTpl:PropTypes.string,
  dataCountTpl:PropTypes.string,
  selectChange:PropTypes.func
};

AccordionMenu.defaultProps = {
  parentId: 6,
  bsStyle:"primary",
  data: {},
  dataListTpl: 'Objectlist',
  dataCountTpl: 'Count',
  selectChange: (id)=>{}
};
AccordionMenu = fetchEnhance(AccordionMenu);

export default AccordionMenu;

class ListMenu extends React.Component {
  constructor (props) {
    super(props);
    let data = props.data;
    this.state = {
      data
    };
  }
  onSelectChange (event) {
    var targetId = event.target.id;
    var menuID=parseInt(targetId.substring(5))
    let mData;
    for (let item of this.state.data[this.props.dataListTpl]){
      if (item.ID===menuID){
        mData=item
      }
    }
    let procsStr=`{"content":"`+mData.Name+`正在建设中..."}`
    let pName="FormTest"
    if(mData.ReactComponent&&mData.ReactComponent!==""){
      pName=mData.ReactComponent
      if(mData.ReactPorps&&mData.ReactPorps!==""){
        procsStr=mData.ReactPorps
      }else{
        procsStr="{}"
      }
    }
    let proc=JSON.parse(procsStr)
    this.props.selectChange(menuID,mData.Name,pName,proc);
  }
  componentWillReceiveProps (nextProps) {
    if (!deepEqual(nextProps.parentId, this.props.parentId)) {
      this.setState({ data: nextProps.parentId});
    }
    if (!deepEqual(nextProps.data, this.props.data)) {
      this.setState({ data: nextProps.data});
    }
  }
  render () {
    let { parentId,bsStyle,dataListTpl,fetchStatus } = this.props;
    let result = [];
    if (fetchStatus !== FETCH_SUCCESS) {
      return <div>{getLang('fetch.status')[fetchStatus]}</div>;
    }
    if (!this.state.data||!this.state.data[dataListTpl]){
      return <div>"返回的数据格式非法</div>; 
    }
    let options = this.state.data[dataListTpl].map((d, i) => {
      result.push(
             <ListGroupItem id={"menu_"+d.ID} key={d.ID} bsStyle={bsStyle} 
                            onClick={this.onSelectChange.bind(this)}>{d.Name}
             </ListGroupItem>
      );
    });
    return <ListGroup key={parentId}>{result}</ListGroup>;
  }
}

ListMenu.propTypes = {
  parentId:PropTypes.number,
  data: PropTypes.object,
  bsStyle:PropTypes.string,
  dataListTpl:PropTypes.string,
  dataCountTpl:PropTypes.string,
  selectChange:PropTypes.func
};

ListMenu.defaultProps = {
  parentId:6,
  bsStyle:"info",
  data: {},
  dataListTpl: 'Objectlist',
  dataCountTpl: 'Count',
  selectChange: (id)=>{}
};
ListMenu = fetchEnhance(ListMenu);

