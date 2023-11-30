/**
 * desc: 分装ant design
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/9/21
 * Time: 上午9:53
 */
import React from 'react';
import {Select as AntdSelect} from "antd";
import {SelectProps} from 'antd/lib/select';
import {DefaultDataContent} from "../defaultDataContent/defaultDataContent";
import './index.scss';

const Option = AntdSelect.Option;

class Select extends React.Component <SelectProps, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const {children, className, placeholder, style, getPopupContainer, ...props} = this.props;
        return (
            <AntdSelect
                className={`gym-form-item-select  ${className ? className : ''}`}
                getPopupContainer={getPopupContainer ? getPopupContainer : () => document.querySelector('.gym-content')}
                dropdownRender={
                    ReactNode => typeof children !== "string" || children.length > 0 ? <div>{ReactNode}</div> :
                        <DefaultDataContent className="no-data-with-no-border"/>
                }
                placeholder={placeholder}
                style={{...style}}
                {...props}
            >
                {children}
            </AntdSelect>
        )
    }
}

export {Select, Option}
