import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Forctory from './factory.js'
import {FETCH_PENDING, FETCH_SUCCESS, FETCH_FAILURE, SERVER_URL} from '../common.js'
import {ButtonToolbar, ButtonGroup, Button, Table, Overlay, Pagination, Label, Form, FormGroup, InputGroup, FormControl, ControlLabel} from 'react-bootstrap';
import { deepEqual, hashcode } from '../utils/objects';
import DataTable from '../addons/DataTable.js';
import TableHeader from '../addons/TableHeader.js';
import refetch from 'refetch';
import { getLang } from '../lang';
import * as rctui from 'rctui'
import * as datetime from '../utils/datetime';
import reactCSS from 'reactcss'
class UserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEdit: false,
            formData:{}
        };
    }
    handleCloseEdit() {
        this.setState({ showEdit: false });
        this.refrush();
    }
    openEdit(){
        let selectData=this.refs.dataTable.getSelected();
        if(!selectData){
            rctui.Message.show("请选择要编辑的行！","warning")
            return
        }
        this.setState({ showEdit: true, formData: selectData })
    }
    refrush(){
        this.refs.dataTable.refrush()
    }
    deleteDatas(){
        this.refs.dataTable.deleteChecked()
    }
    formatDate(data){
        return datetime.format(data,"yyyy-MM-dd")
    }
    render() {
        return (
            <div>
                <ButtonToolbar style={{ margin: "5px 0px", padding: 0 }}>
                    <ButtonGroup>
                        <Button onClick={() => this.setState({ showEdit: true, formData: {} }) }>添加</Button>
                        <Button onClick={this.openEdit.bind(this) }>修改</Button>
                        <Button >查询</Button>
                        <Button onClick={this.deleteDatas.bind(this) }>删除</Button>
                        <Button >导入</Button>
                        <Button onClick={this.refrush.bind(this)}>刷新</Button>
                    </ButtonGroup>
                </ButtonToolbar>
                <DataTable daoName="User" width={1000} height={338} mulitSelect={true} ref="dataTable"
                    headers={[
                        { name: 'ID', sortAble: true, header: '#',align:"left", hidden: true },
                        { name: 'No', sortAble: true, align:"center", header: '员工编号',width:150 },
                        { name: 'Name', sortAble: true, header: '员工名称',width:150 },
                        { name: 'Sex', sortAble: true,align:"left",header: '性别',content: (data) => {return data.Sex==='1'?"男":"女"},width:100},
                        { name: 'Birthday', sortAble: true, header: '生日', content: (data) => {return this.formatDate(data.Birthday)},width:100},
                        { name: 'Organization.Name', sortAble: true, header: '所属部门' ,content: (data) => {return data.Organization.Name},width:200},
                        { name: 'Position.Name', sortAble: true,header: '职位' ,content: (data) => {return data.Position.Name},width:150},
                        { name: 'Serial.Name', sortAble: true,header: '序列' ,content: (data) => {return data.Serial.Name},width:150},
                        { name: 'EMail', sortAble: true,align:"left",header: '邮箱',width:200},
                        { name: 'Telephone', sortAble: true,align:"left",header: '电话',width:200}
                    ]}
                    />
                <UserEdit show={this.state.showEdit} formData={this.state.formData} onClose={this.handleCloseEdit.bind(this) }/>
            </div>
        );
    }
}
export default UserForm
let render=(props)=>React.createElement(UserForm, props);
let f = new Forctory()
f.set("UserForm",render)

class UserEdit extends React.Component {
    constructor(props) {
        super(props);
        let formData = props.formData;
        this.state = {
            formData: formData,
            isAdd: true,
            isChange: false,
            show: false,
            key: 0,
            showMsg: false,
            saveOk: false,
            msgInfo: ""
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.show !== this.props.show) {
            this.setState({ show: nextProps.show });
        }
        if (!deepEqual(nextProps.formData, this.props.formData)) {
            let isAdd = false;
            if (nextProps.formData === {}) {
                isAdd = true;
            } else {
                this.state.key = nextProps.formData.ID
            }
            this.setState({ formData: nextProps.formData, isAdd: isAdd });
        }
    }
    save(formData) {
        let path = this.state.isAdd ? "/Add/" : "/Update/"
        let url = SERVER_URL + path + "User"
        formData.ID = this.state.key
        formData.OrganizationID = Number(formData.OrganizationID)
        formData.PositionID = Number(formData.PositionID)
        formData.SerialID = Number(formData.SerialID)
        formData.Birthday=!formData.Birthday?new Date("0001-01-01"):new Date(formData.Birthday)
        refetch["post"](url, { Entity: JSON.stringify(formData) })
            .then(function (res, xhr) {
                if(this.state.isAdd){
                    this.state.key=res.ID
                }
                this.setState({ isAdd: false, showMsg: true, saveOk: true, msgInfo: "数据保存成功！" });
            }.bind(this))
            .catch(function (error, res, xhr) {
                console.log(error)
                this.setState({ showMsg: true, msgStyle: "danger", saveOk: false, msgInfo: "数据保存失败！错误信息：" + res });
            }.bind(this));
    }
    onEditChange(e) {
        this.state.isChange = true;
    }
    closeMsg() {
        this.setState({ showMsg: false });
    }
    handleClose(){
        this.state.showMsg = false;
        this.props.onClose();
    }
    render() {
        let color = this.state.saveOk ? "green" : "red"
        const styles = reactCSS({
            'default': {
                card: {
                    display: "none"
                }
            },
            'showMsg': {
                card: {
                    display: "block",
                    color: color,
                    cursor: "pointer"
                }
            }
        }, this.props, this.state)
        return (
            <rctui.Modal width={700} header="部门信息维护"
                isOpen={this.state.show}
                onClose={this.handleClose.bind(this)}
                buttons={{
                    '保存': 'submit',
                    '关闭': true
                }}>
                <div onClick={this.closeMsg.bind(this) }>
                    <rctui.Form onSubmit={this.save.bind(this) } data={this.state.formData} layout="aligned">
                        <rctui.FormControl name="No"
                            label="员工编号"
                            placeholder="请输入员工编号..."
                            type="alphanum"
                            grid={{ width: 12 / 24 }}
                            required={true}
                            min={5}
                            max={10}/>
                        <rctui.FormControl name="Name"
                            label="员工名称"
                            placeholder="请输入员工名称..."
                            type="text"
                            required={true}
                            grid={{ width: 12 / 24 }}
                            min={3}
                            max={30} />
                        <rctui.FormControl grid={{ width: 6 / 24 }}
                            name="Sex"
                            label="性别"
                            required={true}
                            data={[{id:'1',text:'男'},{id:'2',text:'女'}]}
                            type="radio-group"/>
                        <rctui.FormControl grid={{ width: 6 / 24 }}
                            name="Birthday"
                            label="生日"
                            type="date"/>
                        <rctui.FormControl name="OrganizationID" label="所属部门" type="select" grid={{ width: 12 / 24 }}
                            placeholder="请选择所属部门..."
                            filterAble={true}
                            required={true}
                            optionTpl='{Name}'
                            valueTpl="{ID}"
                            fetch={{ url: SERVER_URL + "/FindAll/Organization", method: "post", cache: true }} />
                        <rctui.FormControl name="PositionID" label="职位" type="select" grid={{ width: 12 / 24 }}
                            placeholder="请选择职位..."
                            optionTpl='{Name}'
                            valueTpl="{ID}"
                            required={true}
                            fetch={{ url: SERVER_URL + "/FindAll/Position", method: "post", cache: true }} />
                        <rctui.FormControl name="SerialID" label="职位" type="select" grid={{ width: 12 / 24 }}
                            placeholder="请选择序列..."
                            optionTpl='{Name}'
                            valueTpl="{ID}"
                            required={true}
                            fetch={{ url: SERVER_URL + "/FindAll/Serial", method: "post", cache: true }} />
                        <rctui.FormControl grid={{ width: 12 / 24 }}
                            name="EMail"
                            label="邮箱"
                            type="email"/>
                        <rctui.FormControl grid={{ width: 12 / 24 }}
                            name="Telephone"
                            label="电话"
                            type="integer"/>
                     </rctui.Form>
                    <div style={styles.card}>{this.state.msgInfo}</div>
                </div>
            </rctui.Modal>
        );
    }
}
UserEdit.propTypes = {
    formData: PropTypes.object,
    show: PropTypes.bool,
    onClose: PropTypes.func
};
UserEdit.defaultProps = {
    formData: {},
    show: false
};




