import React, { Component, PropTypes } from 'react';
import Forctory from './factory.js'
import { deepEqual, hashcode } from '../utils/objects';
class FieldGroup extends React.Component {
    constructor(props) {
        super(props);
        let formData = props.formData;
        this.state = {
            formData: formData,
            value: ""
        };
    }
    componentWillReceiveProps(nextProps) {
        if (!deepEqual(nextProps.value, this.props.value)) {
            this.setState({ value: nextProps.value });
        }
    }
    renderInput()
    renderSelect()
    renderDateTime()
    renderDateTime()
    render() {
        let { name, label, tip, ...props } = this.props
        return (
            <FormGroup controlId={name}>
                <ControlLabel>{label}</ControlLabel>
                <FormControl {...props} />
                {help && <HelpBlock>{tip}</HelpBlock>}
            </FormGroup>
        );
    }
}
FieldGroup.propTypes = {
    value: PropTypes.string,
    formData: PropTypes.object,
    label: PropTypes.string,
    layout: PropTypes.oneOf(['aligned', 'stacked', 'inline']),
    name: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    tip: PropTypes.string,
    type: PropTypes.string,//type: text,textarea,password，email,integer,number,alpha,alphanum,tel,url,select，date，time，datetime，select，checkbox，checkbox-group，radio-group，
    min: PropTypes.number,
    max: PropTypes.number,
    validator: PropTypes.object,
    fetch: PropTypes.object,
    textTpl: PropTypes.string,
    valueTpl: PropTypes.string
};
FieldGroup.defaultProps = {
    formData: {},
    label: "",
    layout: "aligned",
    placeholder: "",
    readOnly: false,
    required: false,
    name: "",
    tip: "",
    type: "text",
    min: 0,
    max: 0,
    validator: {},
    ignore: true,
    valueTpl: "ID",
    textTpl: "Name",
};