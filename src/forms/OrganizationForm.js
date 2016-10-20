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
import reactCSS from 'reactcss'
class OrganizationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEdit: false
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
    render() {
        let result = [];
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
                <DataTable daoName="Organization" width={1000} height={338} mulitSelect={true} ref="dataTable"
                    headers={[
                        { name: 'ID', sortAble: true, header: '#',align:"left", hidden: true },
                        { name: 'No', sortAble: true, align:"center", header: '部门编号' },
                        { name: 'Name', sortAble: true, header: '部门名称' },
                        { name: 'Parent.Name', sortAble: true, header: '所属部门' ,content: (data) => {return data.Parent.Name}},
                        { name: 'Type.Name', sortAble: true,header: '部门类型' ,content: (data) => {return data.Type.Name}},
                        { name: 'OrderNo', sortAble: true,align:"right",header: '顺序号'}
                    ]}
                    />
                <OrganizationEdit show={this.state.showEdit} formData={this.state.formData} onClose={this.handleCloseEdit.bind(this) }/>
            </div>
        );
    }
}
export default OrganizationForm
let render=(props)=>React.createElement(OrganizationForm, props);
let f = new Forctory()
f.set("OrganizationForm",render)

class OrganizationEdit extends React.Component {
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
        let url = SERVER_URL + path + "Organization"
        formData.ID = this.state.key
        formData.ParentID = Number(formData.ParentID)
        formData.TypeID = Number(formData.TypeID)
        formData.OrderNo = Number(formData.OrderNo)
        console.log(formData)
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
                            label="部门编号"
                            placeholder="请输入部门编号..."
                            type="alphanum"
                            grid={{ width: 12 / 24 }}
                            required={true}
                            min={5}
                            max={10}/>
                        <rctui.FormControl name="Name"
                            label="部门名称"
                            placeholder="请输入部门名称..."
                            type="text"
                            required={true}
                            grid={{ width: 12 / 24 }}
                            min={3}
                            max={30} />
                        <rctui.FormControl name="ParentID" label="所属部门" type="select" grid={{ width: 12 / 24 }}
                            placeholder="请选择所属部门..."
                            filterAble={true}
                            required={true}
                            optionTpl='{Name}'
                            valueTpl="{ID}"
                            fetch={{ url: SERVER_URL + "/FindAll/Organization", method: "post", cache: true }} />
                        <rctui.FormControl name="TypeID" label="部门类型" type="select" grid={{ width: 12 / 24 }}
                            placeholder="请选择部门类型..."
                            optionTpl='{Name}'
                            valueTpl="{ID}"
                            required={true}
                            fetch={{ url: SERVER_URL + "/FindAll/OrganizationType", method: "post", cache: true }} />
                        <rctui.FormControl grid={{ width: 6 / 24 }}
                            name="OrderNo"
                            label="顺序号"
                            required={true}
                            placeholder="请输入部门顺序号..."
                            type="integer"/>
                    </rctui.Form>
                    <div style={styles.card}>{this.state.msgInfo}</div>
                </div>
            </rctui.Modal>
        );
    }
}
OrganizationEdit.propTypes = {
    formData: PropTypes.object,
    show: PropTypes.bool,
    onClose: PropTypes.func
};
OrganizationEdit.defaultProps = {
    formData: {},
    show: false
};




