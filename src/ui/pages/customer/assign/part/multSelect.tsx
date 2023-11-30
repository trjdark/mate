/**
*Desc: GA/GB多选框
*User: Debby.Deng
*Date: 2018/10/9,
*Time: 下午3:45
*/
import * as React from "react";
import {Form, Button, Row, Col, Input} from 'antd';
import {connect} from "../../../../../common/decorator/connect";
import { getAssignGaList, getAssignGbList} from "@redux-actions/customer/assignActions";
import {selectGaList, selectGbList} from "../../../../../saga/selectors/customer/assignSelector";
import {User} from "../../../../../common/beans/user";
import {Select,Option} from "@/ui/component/select";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import moment from "moment";

const FormItem=Form.Item;
declare interface propsFormat{//传入props结构
    onSubmit?:(values)=>(void),
    form?:any,
    showSearchBtn?:boolean,//是否展示查询按钮
    phaseId?:string,
    //以下为自身的
    gaList?:Array<any>,//自身的
    gbList?:Array<any>,//自身的
    getAssignGaList?:any,
    getAssignGbList?:any,
    GAoptions?:any,
    GBoptions?:any,
    defaultGB?:Array<any>,
    defaultGA?:Array<any>,
    [propsName:string]:any,
}
const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])
const selectGAOption = isPostTransRole
    ? {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        roleList: ['GA', 'HGA']
    }
    : {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        postName: ["GA", 'HGA']
    };
const selectGBOption = isPostTransRole
    ? {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        roleList: ['GB', 'HGB']
    }
    : {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        postName: ["GB", 'HGB']
    };

const selectConfig=[
    {
        label:'GB',
        name:'GB',
        id:1
    },
    {
        label:'GA',
        name:'GA',
        id:2
    }
];
@connect((state)=>({
    GAoptions:selectGaList(state),
    GBoptions:selectGbList(state),
    gbList: selectTotalEmployeeList(state, selectGBOption),
    gaList: selectTotalEmployeeList(state, selectGAOption),
}),{getAssignGaList,getAssignGbList})
class MultSelectWrap extends React.Component <propsFormat> {

    handleChange(type){
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.props.onSubmit(values);
            }
        });
    };
    getOptions(options){
        const children=[];
            options.map((option)=>{
                children.push(
                    <Option key={option.staffId} value={option.staffId}>
                        {`${option.englishName} ${option.chineseName}`}
                    </Option>)
            });
        return children;
    }
    getMultSelect=()=>{
        const {defaultGB, defaultGA, gbList, gaList}=this.props;
        const { getFieldDecorator, } = this.props.form;
        const gbChildren = this.getOptions(gbList);
        const gaChildren=this.getOptions(gaList);
        return  selectConfig.map((select,index) => (
            <Col span={8} key={index}>
                <FormItem label={`${select.label}`} className='flex'>
                    {
                        getFieldDecorator(`${select.label}`,{
                            initialValue:select.name === 'GA'
                                            ? defaultGA
                                            : select.name === 'GB'
                                                ? defaultGB
                                                : []
                        })(
                            <Select
                                style={{width:'200px'}}
                                mode="multiple"
                                placeholder=""
                                optionFilterProp="children"
                                onSelect={this.handleChange.bind(this,select.name)}
                                onDeselect={this.handleChange.bind(this,select.name)}
                            >
                                {select.name==='GA' && gaChildren}
                                {select.name==='GB' && gbChildren}
                            </Select>
                        )
                    }
                </FormItem>
            </Col>
        ));
    };

    render(){
        const {showSearchBtn=true}=this.props;
        const { getFieldDecorator } = this.props.form;

        return (
                <div className='bdGrey gym-mult-select'>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={8}>
                                <FormItem label={'手机号'} className='flex'>
                                    {
                                        getFieldDecorator(`phone`,{
                                        })(
                                            <Input placeholder={'留空或11位手机号'} style={{width:'200px'}}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label={'拨打状态'} className='flex'>
                                    {
                                        getFieldDecorator(`callType`,{
                                        })(
                                            <Select
                                                style={{width:'200px'}}
                                                placeholder=""
                                            >
                                                <Option value={0}>已拨打</Option>
                                                <Option value={1}>未拨打</Option>
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            {this.getMultSelect()}
                            {showSearchBtn && <Button className='gym-button-xs gym-button-blue'
                                                      htmlType="submit">查询</Button>}
                        </Row>
                    </Form>
                </div>
        )
    }
}

export {MultSelectWrap}
