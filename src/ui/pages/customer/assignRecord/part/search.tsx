import React from 'react'
import {form} from "@/common/decorator/form";
import {Row,Col,Form,Input,Button,Select} from 'antd'
import {getAssignGaList, getAssignGbList} from "@redux-actions/customer/assignActions";
import {getAssignRecordList} from "@redux-actions/customer/assignRecord";
import {selectGaList, selectGbList} from "@/saga/selectors/customer/assignSelector";
import {connect} from "@/common/decorator/connect";
import {User} from "@/common/beans/user";
const FormItem = Form.Item;
const Option = Select.Option;

@connect(state=>({
    gaList: selectGaList(state),
    gbList: selectGbList(state)
}),{getAssignGaList,getAssignGbList,getAssignRecordList})
@form()

class AssignRecordSearch extends React.Component <any, any>{
    constructor(props) {
        super(props);
        this.state={
            pager:{
                pageNo:1,
                pageSize:10
            }
        }
    }

    onHandleSearch = ()=>{
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.props.getAssignRecordList({
                babyName:values.bbname,
                staffGAIdList:(values.ga.length>0)?values.ga:null,
                staffGBIdList:(values.gb.length>0)?values.gb:null,
                pageNo:this.state.pager.pageNo,
                pageSize:this.state.pager.pageSize,
                distributeType:this.props.type,
                currentCenterId:User.currentCenterId
            })
            this.props.onWrapperSetState({
                bbname:values.bbname,
                ga:values.ga,
                gb:values.gb
            })
          }
        });
    }

    onHandleReset = ()=>{
        this.props.form.setFieldsValue({gb:[],ga:[],bbname:''})
    }

    componentDidMount (){
        let params = {currentCenterId:User.currentCenterId}
        this.props.getAssignGaList(params)
        this.props.getAssignGbList(params)
        this.onHandleSearch()
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {xs: { span: 24 },sm: { span: 8 }},
            wrapperCol: {xs: { span: 24 },sm: { span: 8 }}
        };
        return(
            <div>
                <Row>
                    <Col span={8}>
                        <FormItem label={'宝宝姓名'} {...formItemLayout}>
                            {getFieldDecorator(`bbname`, {
                                rules: [],
                                initialValue: ""
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'GB'} {...formItemLayout}>
                            {getFieldDecorator(`gb`, {
                                rules: [],
                                initialValue: []
                            })(
                                <Select mode="multiple"
                                        style={{ width: '200px' }}
                                        placeholder="请选择GB"
                                >
                                    {this.props.gbList.map(item=>
                                        <Option key={item.staffId} value={item.staffId}>{item.chineseName}</Option>
                                    )}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'GA'} {...formItemLayout}>
                            {getFieldDecorator(`ga`, {
                                rules: [],
                                initialValue: []
                            })(
                                <Select mode="multiple"
                                        style={{ width: '200px' }}
                                        placeholder="请选择GA"
                                >
                                    {this.props.gaList.map(item=>
                                        <Option key={item.staffId} value={item.staffId}>{item.chineseName}</Option>
                                    )}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row type='flex' justify='end'>
                    <Button className='btnSearch' onClick={this.onHandleSearch}>查询</Button>
                    <Button className='btnReset' onClick={this.onHandleReset}>重置</Button>
                </Row>
            </div>
        )
    }
}

export {AssignRecordSearch}
