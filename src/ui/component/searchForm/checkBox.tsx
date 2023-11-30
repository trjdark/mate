/**
 * desc: 卡片组件
 * User: Katarina
 * Date: 2021/9/28
 * Time: 下午4:20
 */
import React from 'react';
import {Checkbox, Card} from "antd";
import {columns} from "@/ui/pages/report/visitForm/enum";

class SearchFormCheckBox extends React.Component <any, any> {
    constructor(props:any){
        super(props)
        this.state = {
            indeterminate: true,    // 半选的样式开关
            checkAll: false,        // 全选样式开关
            fullFields: []          // 全部数据项
        }
    }
    componentDidMount() {
        const fullFields = this.props.items.options.map(item=>item.postCode)
        this.setState({fullFields});
        this.props.onRef(this)
    }
    // 全选按钮的点击事件
    onCheckAllChange = () => {
        const {checkAll, fullFields} = this.state
        this.setState({
                          indeterminate: false,
                          checkAll: !checkAll,
                      });
        // 判断是否全选状态，修改数据项的勾选
        if (checkAll) {
            // setFieldsValue的对象名要和下面的getFieldDecorator名字一致
            this.props.form.setFieldsValue({ checkbox: [] })
            this.props.items.handleChange([])
        } else {
            this.props.form.setFieldsValue({ checkbox: fullFields })
            let arr = columns.filter(item => fullFields.includes(item.postCode))
                .map(item => ({dataIndex: item.postCode,title: item.postName}))
            // 修改表头
            this.props.items.handleChange(arr)
        }

    };
    // 排序勾选
    sortCheckBox = (list) => {
        let result = [];
        list.sort(function(a, b){
            return a.finallyId - b.finallyId
        });
        list.forEach((item) => {
            if(result[item.finallyId]){
                result[item.finallyId].push(item)
            }else{
                result[item.finallyId] = [item]
            }
        });
        return result;
    };
    // 勾选数据项改变表头
    handleColumnsChange = (value) => {
        const {fullFields} = this.state
        let arr = columns.filter(item => value.includes(item.postCode))
            .map(item => ({dataIndex: item.postCode, title: item.postName}))
        this.setState({
                          indeterminate: !!value.length && (value.length < fullFields.length),
                          checkAll: value.length === fullFields.length,
                      })
        this.props.items.handleChange(arr)
    }
    onReset = () => {
        this.setState({
                          indeterminate: true,    // 半选的样式开关
                          checkAll: false,        // 全选样式开关
                      })
    }
    render() {
        const {items, form} = this.props
        const {getFieldDecorator} = form
        const {indeterminate, checkAll} = this.state
        return (
            <Card
                className='gym-form-item-checkbox-card'
                title={
                    <Checkbox
                        indeterminate={indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={checkAll}
                    >
                        全选
                    </Checkbox>}
            >
                {
                    getFieldDecorator(items.type, {
                        initialValue: items.initialValue
                    })(
                        <Checkbox.Group
                            onChange={this.handleColumnsChange}
                        >
                            {
                                (this.sortCheckBox(items.options) || []).map((item: any, index: number) =>
                                     <div key={index} className='gym-form-item-checkbox-card-list'>
                                         {
                                             item.map((item2: any, index2: number)=>(
                                                 <Checkbox value={item2.postCode} key={`${item2.postCode}_${index2}`}>
                                                     {item2.postName}
                                                 </Checkbox>
                                             ))
                                         }

                                     </div>
                                )
                            }
                        </Checkbox.Group>
                    )
                }
            </Card>
        )
    }
}

export {SearchFormCheckBox};
