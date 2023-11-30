/**
 * desc: 封装输入框
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/2
 * Time: 下午1:45
 */
import React from 'react';
import {InputNumber as AntdInputNumber, Input as AntdInput} from "antd";
import './index.scss';

const AntdTextArea = AntdInput.TextArea;

class InputNumber extends React.Component<any, any> {
    static pattern = /\B(?=(\d{3})+(?!\d))/g;   // 千分位
    // static patternNum = /^(-)?\d{1,3}(,\d{3})*(.\d+)?$/;    // 验证是数字
    static formatter(value: string | number) {
        /*把用户输入的数字转换成千分位的形式*/
        const newValue = value.toString();
        if(InputNumber.pattern.test(newValue)){
            return newValue.toString().replace(InputNumber.pattern, ',');
        }
        return newValue;
    }

    render() {
        const {formatter, className} = this.props;
        return (
            <AntdInputNumber
                className={`gym-item-input-number ${className ? className : ''}`}
                formatter={formatter || InputNumber.formatter}
                {...this.props}
            />
        )
    }
}

class Input extends React.Component<any, any> {
    render() {
        const maxLength = this.props.maxLength || 50;
        const {className} = this.props;
        return (
            <AntdInput
                className={`gym-item-input ${className ? className : ''}`}
                maxLength={maxLength}
                {...this.props}
            />
        )
    }
}

class TextArea extends React.Component<any, any> {
    render() {
        const maxLength = this.props.maxLength || 200;
        const {className} = this.props;
        return (
            <AntdTextArea
                className={`gym-item-input-textarea ${className ? className : ''}`}
                maxLength={maxLength}
                {...this.props}
            />
        )
    }
}

export {InputNumber, Input, TextArea}
