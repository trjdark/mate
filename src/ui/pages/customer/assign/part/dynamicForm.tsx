/**
 * desc: 分配客户动态生成GA/GB form list
 * User: Debby.Deng
 * Date: 2018/10/10
 * Time: 上午10:49
 */

import { InputNumber} from 'antd';
import * as React from "react";
import {Icon} from "../../../../component/icon";


declare interface dynamicProps{
    list:Array<gagbConfig>,
    form:any,
    removeEmployee:(id)=>(void),//删除gb/ga
}
declare interface gagbConfig{
    name:string,//英文中文名
    staffId:string,//ga/gb ID
    average?:number,//平均分配数量
}
class DynamicGaGbList extends React.Component<dynamicProps> {
    remove = (id) => {
        this.props.removeEmployee(id);
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: this.props.list });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            const average=k.average||'';
            return (
                <li key={k.staffId} className='flex gym-dynamic-form-flex'>
                    <label className='gym-dynamic-form-name'>
                    {getFieldDecorator(`names[${k.staffId}]`, {
                        initialValue:k.staffId
                    })(
                         <div>{`${k.englishName}${k.chineseName}`}</div>
                      )}
                    </label>
                    <label className='gym-dynamic-form-leads-number'>分配数:&nbsp;
                        {getFieldDecorator(`leadsNum[${k.staffId}]`, {
                            initialValue:average||1
                        })(
                            <InputNumber min={0} precision={0}/>
                        )}
                    </label>
                    <Icon className='fr ml20 c999' type='close' onClick={this.remove.bind(this,k.staffId)}/>
                 </li>
        );
        });
        return (
                <ul className='gym-dynamic-form'>
                 {formItems}
                </ul>
        );
    }
}

export{DynamicGaGbList}
