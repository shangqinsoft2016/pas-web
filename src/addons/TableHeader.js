'use strict';

import React, { Component, PropTypes } from 'react';
class TableHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      asc: 0
    };
    this.onSort = this.onSort.bind(this);
  }
  onSort() {
    let asc = this.state.asc === 0 || this.state.asc === 1 ? this.state.asc + 1 : 0;
    this.setState({ asc });
    this.props.onSort(this.props.name, asc);
  }
  render() {
    let sort = [],
      onSort = null,
      style = {textAlign:'center'};
    if (this.props.sortAble) {
      style = { cursor: 'pointer',textAlign:'center' };
      onSort = this.onSort;
      let cName = "icon-sort pull-right";
      if (this.state.asc === 1) {
        cName = "icon-sort-up pull-right"
      } else if (this.state.asc === 2) {
        cName = "icon-sort-down pull-right"
      }
      let key=this.props.name+"sort"
      sort.push(<i className={cName} style={style} key={key}></i>)
    }
    return (
      <th style={style} onClick={onSort} key={this.props.name}>
        {sort}
        {this.props.header}
      </th>
    );
  }
}

TableHeader.propTypes = {
  content: PropTypes.any,
  header: PropTypes.any,
  hidden: PropTypes.bool,
  name: PropTypes.string,
  onSort: PropTypes.func,
  sortAble: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

TableHeader.defaultProps = {
  hidden: false
};

export default TableHeader;
