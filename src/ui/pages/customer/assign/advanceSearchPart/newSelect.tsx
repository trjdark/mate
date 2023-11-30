import * as React from "react";
import {Select as AntdSelect} from "antd";

const SelectOption=AntdSelect.Option;
class Select extends React.Component<any>{
    render(){
        const {children,...rest}=this.props;
        return (
            <AntdSelect getPopupContainer={() => document.querySelector('.gym-advanced-search')}
                    {...rest}>
                {children}
            </AntdSelect>
        )
    }
}
export {Select,SelectOption};
