/**
 * desc: 新建
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/5
 * Time: 下午2:20
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Form, message} from "antd";
import {form} from "@/common/decorator/form";
import {Select, Option} from "@/ui/component/select";
import {Input} from "@/ui/component/input";
import {CancelButton} from "@/ui/component/cancelButton";
import {User} from "@/common/beans/user";
import {getExNum, addLandLine} from "@redux-actions/telephone/callLeads";
import {Routes} from "@/router/enum/routes";
import history from "@/router/history";
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
const FormItem = Form.Item;

const selectOption = {
    workingStatus: "1",
};

@connect((state) => ({
    memberList: selectTotalEmployeeList(state, selectOption)
}), {})
@form()
class LandLineAdd extends React.Component<any, any>{
    private routes:Array<any> = [
        {
            name: '云语音',
            path: '',
            link: '#',
            id: 'telephone'
        },{
            name: '坐席分配',
            path: '',
            link: '#',
            id: 'landline'
        },{
            name: '新建坐席',
            path: '',
            link: '#',
            id: 'telephone-land-line-add'
        }
    ];
    state = {
        exNumberList: [],
        memberList: []
    }
    componentDidMount(){
        try{
            Promise.all([
                getExNum({currentCenterId:User.currentCenterId}),

            ]).then((res:any) => {
                this.setState({
                    exNumberList: res[0],
                })
            })
        }catch (e) {

        }

    }
    handleSubmit = () => {
        const {validateFields} = this.props.form;
        validateFields((err, values) => {
            if(!err){
                const data = Object.assign({}, values, {
                    currentCenterId: User.currentCenterId,
                    fromType: "1"
                })
                addLandLine(data)
                    .then((res:any) => {
                        message.success("添加成功", 2, () => {history.push(Routes.坐席分配.path)})
                    })
            }
        })
    }
    render(){
        const {form, memberList} = this.props;
        const {exNumberList,} = this.state;
        const { getFieldDecorator } = form;
        return(
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div id={`gym-telephone-land-line-add`} className="gym-telephone-land-line-add page-wrap">
                    <Form >
                        <FormItem label={'用户名'}>
                            {
                                getFieldDecorator('tmkStaffId', {
                                    rules: [{required: true, message: '请输入用户名'},],
                                })(
                                    <Select
                                        className="gym-telephone-land-line-add-select"
                                        showSearch
                                        filterOption={(input, option:any) => option.props.children.indexOf(input) >= 0}
                                    >
                                        {
                                            (memberList || []).map((item:any, index:number) =>
                                                <Option
                                                    key={`GI_${item.staffId}${index}`}
                                                    value={item.staffId}
                                                >{item.userName}</Option>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label={'手机号'}>
                            {
                                getFieldDecorator('phone')(
                                    <Input type={'text'} placeholder={``} />
                                )
                            }
                        </FormItem>
                        <FormItem label={'分机号'}>
                            {
                                getFieldDecorator('tmkAccountId', {
                                    rules: [{required: true, message: '请输入分机号'},],
                                })(
                                    <Select
                                        className="gym-telephone-land-line-add-select"
                                        showSearch
                                        filterOption={(input, option:any) => option.props.children.indexOf(input) >= 0}
                                    >
                                        {
                                            (exNumberList || []).map((item:any, index:number) =>
                                                <Option
                                                    key={`GI_${item.id}${index}`}
                                                    value={item.id}
                                                >{item.exNumber}</Option>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                        <CancelButton handleSubmit={this.handleSubmit} form={form}/>
                    </Form>
                </div>
            </Fragment>
        )
    }
}

export {LandLineAdd}
