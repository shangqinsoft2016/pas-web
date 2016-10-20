'use strict';

import React, { Component, PropTypes, cloneElement } from 'react';
import ReactDOM from 'react-dom';
import { substitute } from '../utils/strings';
import { deepEqual, hashcode } from '../utils/objects';
import TableHeader from './TableHeader';
import {FETCH_PENDING, FETCH_SUCCESS, FETCH_FAILURE, SERVER_URL} from '../common.js'
import {ButtonToolbar, ButtonGroup, Button, Table, Pagination, Form, FormGroup, InputGroup, FormControl, Checkbox} from 'react-bootstrap';
import { getLang } from '../lang';
import refetch from 'refetch';
import * as rctui from 'rctui'
class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            sorts: [],
            pageNumber: 1,
            rowCount: 10,
            pageCount: 0,
            selectIndex: -1,
            fetchStatus: FETCH_SUCCESS,
        };
        this.onBodyScroll = this.onBodyScroll.bind(this);
        this.getAllChecked = this.getAllChecked.bind(this);
        this.getSelected = this.getSelected.bind(this);
        this.refrush = this.refrush.bind(this);
    }
    componentDidMount() {
        this.setHeaderWidth();
    }
    componentWillMount() {
        this.fetchData(this.state.pageNumber, this.state.rowCount)
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.state.pageNumber !== nextState.pageNumber ||
            this.state.rowCount !== nextState.rowCount) {
            this.fetchData(nextState.pageNumber, nextState.rowCount)
        }
    }
    componentDidUpdate() {
        this.setHeaderWidth();
    }
    checkHeadFixed() {
        const { height } = this.props;
        return !!height && height !== 'auto';
    }
    setHeaderWidth() {
        if (!this.checkHeadFixed()) {
            return;
        }
        let body = ReactDOM.findDOMNode(this.refs.body);
        let tr = body.querySelector('tr');
        if (!tr) {
            return;
        }
        let header = ReactDOM.findDOMNode(this.refs.header);
        let ths = header.querySelectorAll('th');
        let tds = tr.querySelectorAll('td');
        if (tds.length <= 1) {
            return;
        }
        for (let i = 0, count = tds.length; i < count; i++) {
            if (ths[i]) {
                ths[i].style.width = tds[i].offsetWidth + 'px';
            }
        }
    }
    findIndex(i) {
        return this.state.selectIndexs.findIndex((val) => val === i)
    }
    onSelect(i, e) {
        let index = this.state.selectIndex;
        let data = this.state.data;
        if (i === index) {
            data[i].$checked = false;
            index = -1
        } else {
            if (!this.props.mulitSelect) {
                let data = this.state.data, start = 0, end = data.length
                for (; start < end; start++) {
                    data[start].$checked = false;
                }
            }
            data[i].$checked = true;
            index = i
        }
        this.setState({ selectIndex: index });
    }
    onCheck(i, e) {
        let checked = typeof e === 'boolean' ? e : e.target.checked,
            data = this.state.data,
            size = data.length,
            start = 0,
            end = 0
        if (i === 'all') {
            start = 0;
            end = size;
        } else {
            start = i;
            end = i + 1;
        }
        for (; start < end; start++) {
            data[start].$checked = checked;
        }
        this.setState({ data });
    }
    getSelected(name) {
        if (this.state.selectIndex === -1) {
            return null;
        }
        let d = this.state.data[this.state.selectIndex]
        return name ? d[name] : d
    }
    getAllChecked(name) {
        let values = [];
        this.state.data.forEach((d) => {
            if (d.$checked) {
                values.push(name ? d[name] : d);
            }
        });
        return values;
    }
    refrush() {
        this.fetchData(this.state.pageNumber, this.state.rowCount)
    }
    deleteChecked() {
        let vals = this.getAllChecked(this.props.dataKey)
        if (vals.length === 0) {
            rctui.Message.show("请选择要删除的行！", "info")
            return
        }
        if (!confirm('确定要删除选择的信息吗？\n此操作不可以恢复！')) {
            return;
        }
        let url = SERVER_URL + "/Deletes/Organization"
        refetch["post"](url, { PrimaryKeyValues: JSON.stringify(vals) })
            .then(function (res, xhr) {
                this.refrush()
            }.bind(this))
            .catch(function (error, res, xhr) {
                rctui.Message.show("删除数据失败！错误信息：" + res, "error")
            }.bind(this));
    }
    onBodyScroll(e) {
        let hc = this.refs.headerContainer;
        hc.style.marginLeft = (0 - e.target.scrollLeft) + 'px';
    }
    fetchData(pageNumber, rowCount) {
        let {serverUrl, dataListTpl, dataCountTpl} = this.props;
        this.setState({ fetchStatus: FETCH_PENDING });
        let data = {}
        data.OrderItems = JSON.stringify(this.state.sorts)
        refetch.post(SERVER_URL + "/Find/" + this.props.daoName + "/" + pageNumber + "/" + rowCount, data)
            .then(function (res, xhr) {
                this.state.data = res[dataListTpl];
                let count = res[dataCountTpl];
                this.state.pageCount = Math.ceil(rowCount === 0 ? 0 : count / rowCount);
                this.setState({ fetchStatus: FETCH_SUCCESS });
            }.bind(this))
            .catch(function (error, res, xhr) {
                console.log(error)
                this.state.data = res
                this.state.pageCount = 0
                this.setState({ fetchStatus: FETCH_FAILURE });
            }.bind(this));
    }
    handlePaginationChange(eventKey) {
        this.setState({ pageNumber: eventKey });
    }
    handlePageCountChange(e) {
        this.setState({ rowCount: e.target.value });
    }
    handleSort(name, asc) {
        let sorts = this.state.sorts
        let index = this.findSortIndex(name)
        let sort = {}
        let {orderNameTpl, orderDirectionTpl} = this.props
        if (index === -1) {
            if (asc === 0) return;
            sort[orderNameTpl] = name;
            sort[orderDirectionTpl] = asc === 1 ? "ASC" : "DESC";
            sorts.push(sort)
        } else {
            if (asc === 0) {
                sorts.splice(index, 1)
            } else {
                sorts[index][orderDirectionTpl] = asc === 1 ? "ASC" : "DESC";
            }
        }
        this.refrush();
    }
    findSortIndex(name) {
        let orderNameTpl = this.props.orderNameTpl
        return this.state.sorts.findIndex((val) => val[orderNameTpl] === name)
    }
    renderBody() {
        const { selectAble, mulitSelect, headers, dataKey} = this.props;
        if (this.state.fetchStatus !== FETCH_SUCCESS) {
            return <tbody><tr><td colSpan={headers.length}>{getLang('fetch.status')[this.state.fetchStatus]}</td></tr></tbody>;
        }
        let data = this.state.data;
        const headerKeys = headers.map((h) => {
            return h.name || hashcode(h);
        });
        let trs = data.map((d, i) => {
            let tds = [];
            if (selectAble && mulitSelect) {
                tds.push(
                    <td key="checkbox" style = {{ textAlign: 'center' }}>
                        <input type="checkbox" checked={d.$checked} onChange={this.onCheck.bind(this, i) }/>
                    </td>
                );
            }
            let rowKey = d[dataKey] ? d[dataKey] : hashcode(d);
            headers.map((h, j) => {
                if (h.hidden) {
                    return;
                }
                let content = h.content,
                    tdStyle = {};
                if (typeof content === 'string') {
                    content = substitute(content, d);
                } else if (typeof content === 'function') {
                    content = content(d);
                } else {
                    content = d[h.name];
                }
                let align = h.align ? h.align : "left"
                tdStyle.textAlign = align;
                if (h.width) {
                    tdStyle.width = h.width;
                }
                tds.push(<td style={tdStyle} key={headerKeys[j]}>{content}</td>);
            });
            let trStyle = {}
            if (this.state.selectIndex === i) {
                trStyle.backgroundColor = "#5BC0DE"
                trStyle.color = "#FFF"
            }
            return <tr key={rowKey} style={trStyle} onClick={this.onSelect.bind(this, i) }>{tds}</tr>;
        });
        return <tbody>{trs}</tbody>;
    }
    renderHeader() {
        let headers = [];
        if (this.props.selectAble && this.props.mulitSelect) {
            headers.push(
                <TableHeader key="checkbox" name="$checkbox" onSort={this.handleSort.bind(this) } header={
                    <input type="checkbox" onClick={this.onCheck.bind(this, 'all') } ref="checkAll"/>
                }/>
            );
        }
        this.props.headers.map((header, i) => {
            if (header.hidden) {
                return;
            }
            let props = {
                key: header.name || i,
                onSort: (name, asc) => {
                    this.handleSort(name, asc)
                },
            };
            headers.push(
                <TableHeader {...header} {...props} />
            );
        });
        return <tr>{headers}</tr>;
    }
    renderPagination() {
        if (!this.props.pagination) {
            return null;
        }
        let pNumber = this.state.pageNumber > this.state.pageCount ? this.state.pageCount : this.state.pageNumber
        return (
            <ButtonToolbar style={{ margin: "5px 0px", padding: 0 }}>
                <ButtonGroup>
                    <Form componentClass="fieldset" inline>
                        <FormGroup>
                            <InputGroup>
                                <InputGroup.Addon>显示行数</InputGroup.Addon>
                                <FormControl componentClass="select" value={this.state.rowCount} onChange={this.handlePageCountChange.bind(this) }>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                </FormControl>
                            </InputGroup>
                        </FormGroup>
                    </Form>
                </ButtonGroup>
                <ButtonGroup>
                    <Pagination style={{ padding: 0, margin: 0, float: "right" }}
                        prev
                        next
                        first
                        last
                        ellipsis
                        boundaryLinks
                        items={this.state.pageCount}
                        maxButtons={5}
                        activePage={pNumber}
                        onSelect={this.handlePaginationChange.bind(this) } />
                </ButtonGroup>
            </ButtonToolbar>);
    }
    render() {
        let bodyStyle = {},
            headerStyle = {},
            tableStyle = {},
            onBodyScroll = null,
            data = this.state.data
        const { height, width, bordered, striped } = this.props;
        let fixedHead = this.checkHeadFixed();
        if (height) {
            bodyStyle.height = height;
            bodyStyle.overflow = 'auto';
        }
        if (width) {
            headerStyle.width = width;
            if (typeof headerStyle.width === 'number') {
                headerStyle.width += 20;
            }
            tableStyle.width = width;
            tableStyle.marginBottom = 0;
            bodyStyle.overflow = 'auto';
            onBodyScroll = this.onBodyScroll;
        }
        return (
            <div style={this.props.style}>
                { fixedHead &&
                    <div>
                        <div ref="headerContainer" style={headerStyle}>
                            <Table striped={striped} bordered={bordered} style={tableStyle} condensed hover ref="header">
                                <thead>{this.renderHeader() }</thead>
                            </Table>
                        </div>
                    </div>
                }
                <div onScroll={onBodyScroll} style={bodyStyle}>
                    <Table striped={striped} bordered={bordered} style={tableStyle} condensed hover ref="body">
                        { !fixedHead && <thead>{this.renderHeader() }</thead> }
                        {this.renderBody() }
                    </Table>
                </div>
                {this.renderPagination() }
            </div>
        );
    }
}
DataTable.propTypes = {
    bordered: PropTypes.bool,
    dataKey: PropTypes.string,
    filters: PropTypes.array,
    headers: PropTypes.array,
    height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    pagination: PropTypes.bool,
    selectAble: PropTypes.bool,
    mulitSelect: PropTypes.bool,
    striped: PropTypes.bool,
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    daoName: PropTypes.string,
    dataListTpl: PropTypes.string,
    dataCountTpl: PropTypes.string,
    orderNameTpl: PropTypes.string,
    orderDirectionTpl: PropTypes.string
};

DataTable.defaultProps = {
    data: [],
    selectAble: true,
    muliSelect: false,
    pagination: true,
    bordered: true,
    striped: true,
    dataKey: "ID",
    dataListTpl: "Objectlist",
    dataCountTpl: "Count",
    orderNameTpl: "FieldName",
    orderDirectionTpl: "Direction"
}

export default DataTable;

