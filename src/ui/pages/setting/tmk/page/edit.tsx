/**
 * desc: 编辑tmk中心页面
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/18
 * Time: 上午9:18
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {form} from "@/common/decorator/form";
import {Form, message} from "antd";
import {Select, Option} from "@/ui/component/select";
import {Input} from "@/ui/component/input";
import {connect} from "@/common/decorator/connect";
import {selectTmkGIList} from "@/saga/selectors/setting/tmk";
import {User} from "@/common/beans/user";
import {queryHTmkMemberList, queryTmkMemberList, getTmkCenterInfo, updateTmkCenter} from "../../../../../redux-actions/setting/tmk";
import {CommonUtils} from "@/common/utils/commonUtils";
import {CancelButton} from "@/ui/component/cancelButton";
import {selectAllCenterList} from "@/saga/selectors/setting/employee";
import history from "@/router/history";
import {Routes} from "@/router/enum/routes";
const FormItem = Form.Item;

@connect((state: any) => ({
    GIList: selectTmkGIList(state),
    centerList: selectAllCenterList(state),
}), {})
@form()
class TmkTelephoneCenterEdit extends React.Component<any, any>{
    private routes:Array<any> = [
        {
            name: '设置',
            path: '',
            link: '#',
            id: 'setting'
        },{
            name: '运营管理',
            path: '',
            link: '#',
            id: 'operation'
        },{
            name: 'TMK呼叫中心设置',
            path: '',
            link: '#',
            id: 'tmk'
        },
    ];
    formItemLayout = {
        labelCol: {
            sm: { span: 4 },
            md: { span: 8 }
        },
        wrapperCol: {
            sm: { span: 20 },
            md: { span: 16 }
        },
    };
    tmkCenterId:any
    constructor(props:any){
        super(props)
        if(CommonUtils.hasParams(props)){
            this.tmkCenterId = CommonUtils.parse(props).tmkCenterId;
            this.state = {
                disableCenterChoose: true,
                tmkCenterList: [],
                disableHTMKChoose: true,
                HTMKList: [],
                TMKList: [],
                tmkCenterInfo:{}
            }
        }
    }
    componentDidMount(){
        const param = {currentCenterId: User.currentCenterId};
        Promise.all([
            queryHTmkMemberList(param),
            queryTmkMemberList(param),
            getTmkCenterInfo({
                currentCenterId:User.currentCenterId,
                tmkCenterId: this.tmkCenterId
            }),
        ]).then((res) => {
            this.setState({
                HTMKList: res[0],
                TMKList: res[1],
                tmkCenterInfo: res[2]
            })
        });
    }
    handleSubmit = () => {
        const {validateFields} = this.props.form;
        const {tmkCenterInfo} = this.state;
        validateFields((err, values) => {
            if(!err){
                if(!Array.isArray(values.associatedCenter)){
                    values.associatedCenter = [values.associatedCenter]
                }
                if(!Array.isArray(values.associatedHtmk)){
                    values.associatedHtmk = [values.associatedHtmk]
                }
                if(!Array.isArray(values.associatedTmk)){
                    values.associatedTmk = [values.associatedTmk]
                }
                const data = Object.assign({}, values, {
                    id: tmkCenterInfo.id,
                    currentCenterId: User.currentCenterId
                })
                updateTmkCenter(data)
                    .then((res:any) => {
                        message.success("更新成功", 2, () => {history.push(Routes.TMK呼叫中心设置.path)})
                    }, (err) => {
                        message.error(`更新失败，${err.msg}`)
                    })
            }
        })
    };
    render(){
        const {GIList, form, centerList} = this.props;
        const { getFieldDecorator } = form;
        const {HTMKList, TMKList, tmkCenterInfo} = this.state;
        return(
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id={`gym-tmk-add`} className="gym-tmk-add page-wrap">
                    <Form >
                        <FormItem label={'TMK中心名称'} {...this.formItemLayout}>
                            {
                                getFieldDecorator('tmkCenterName', {
                                    rules: [{required: true, message: '请输入TMK中心名称'},],
                                    initialValue: tmkCenterInfo.tmkCenterName
                                })(
                                    <Input type={'text'} placeholder={``} maxLength={30}/>
                                )
                            }
                        </FormItem>
                        <FormItem label={'所属GI'} {...this.formItemLayout}>
                            {
                                getFieldDecorator('associatedGi', {
                                    rules: [{required: true, message: '请选择所属GI'},],
                                    initialValue: tmkCenterInfo.associatedGi
                                })(
                                    <Select
                                        className="gym-tmk-add-select"
                                        showSearch
                                        filterOption={(input, option:any) => option.props.children.indexOf(input) >= 0}
                                    >
                                        {
                                            (GIList || []).map((item:any, index:number) =>
                                                <Option
                                                    key={`GI_${item.id}${index}`}
                                                    value={item.id}
                                                >{item.username}</Option>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label={'添加中心'} {...this.formItemLayout}>
                            {
                                getFieldDecorator('associatedCenter', {
                                    rules: [{required: true, message: '请选择中心'},],
                                    initialValue: (tmkCenterInfo.associatedCenter || []).map(item => item.id)
                                })(
                                    <Select
                                        className="gym-tmk-add-select"
                                        mode="multiple"
                                        showSearch
                                        optionFilterProp="children"
                                    >
                                        {
                                            (centerList || []).map((item:any, index:number) =>
                                                <Option
                                                    key={`Center_${item.id}${index}`}
                                                    value={item.id}
                                                >{item.centerCode}-{item.centerName}</Option>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label={'添加HTMK用户名'} {...this.formItemLayout}>
                            {
                                getFieldDecorator('associatedHtmk', {
                                    rules: [{required: true, message: '请选择HTMK'},],
                                    initialValue: (tmkCenterInfo.associatedHtmk || []).map(item => item.id)
                                })(
                                    <Select
                                        className="gym-tmk-add-select"
                                        showSearch
                                        optionFilterProp="children"
                                        mode="multiple"
                                    >
                                        {
                                            HTMKList.map((item:any, index:number) =>
                                                <Option
                                                    key={`HTMK_${item.id}${index}`}
                                                    value={item.id}
                                                >{item.username}</Option>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label={'添加TMK用户名'} {...this.formItemLayout}>
                            {
                                getFieldDecorator('associatedTmk', {
                                    rules: [{required: true, message: '请选择TMK'},],
                                    initialValue: (tmkCenterInfo.associatedTmk || []).map(item => item.id)
                                })(
                                    <Select
                                        className="gym-tmk-add-select"
                                        mode="multiple"
                                        showSearch
                                        optionFilterProp="children"

                                    >
                                        {
                                            TMKList.map((item:any, index:number) =>
                                                <Option
                                                    key={`HTMK_${item.id}${index}`}
                                                    value={item.id}
                                                >{item.username}</Option>
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

export {TmkTelephoneCenterEdit}
