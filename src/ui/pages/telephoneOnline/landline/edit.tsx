/**
 * desc: 编辑
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/16
 * Time: 上午10:59
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Form, message, Modal} from "antd";
import {form} from "@/common/decorator/form";
import {Select, Option} from "@/ui/component/select";
import {Input} from "@/ui/component/input";
import {CancelButton} from "@/ui/component/cancelButton";
import {User} from "@/common/beans/user";
import {getExNum, editLandLine, getSeatInfo, checkLandLine} from "@redux-actions/telephone/callLeads";
import {Routes} from "@/router/enum/routes";
import history from "@/router/history";
import {CommonUtils} from "@/common/utils/commonUtils";
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

class LandLineEdit extends React.Component<any, any>{
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
            name: '编辑',
            path: '',
            link: '#',
            id: 'telephone-land-line-edit'
        }
    ];
    state:any
    seatId:string
    constructor(props:any){
        super(props)
        if(CommonUtils.hasParams(props)){
            this.seatId = CommonUtils.parse(props).id;
        }
        this.state = {
            exNumberList: [],
            memberList: [],
            seatInfo: {},
            visible: false,
            msg: ''
        }
    }
    componentDidMount(){
        try{
            Promise.all([
                getExNum({currentCenterId:User.currentCenterId}),

                getSeatInfo({
                    currentCenterId:User.currentCenterId,
                    id: this.seatId,
                    fromType: "1"
                })
            ]).then((res:any) => {
                this.setState({
                    exNumberList: res[0],
                    seatInfo: res[1]
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
                    id: this.seatId
                });
                checkLandLine(data)
                    .then((res:any) => {
                        if(res.result){
                            this.handleExitSeat();
                        }else{
                            this.setState({
                                visible:true,
                                msg: res.resultMessage
                            })
                        }
                    })
            }
        })
    };
    close = () => {
        this.setState({visible:false, msg: ''})
    };
    ok = () => {
        this.setState({visible:false,msg: ''});
        this.handleExitSeat();
    };
    handleExitSeat = () => {
        const {validateFields} = this.props.form;
        validateFields((err, values) => {
            if(!err){
                const data = Object.assign({}, values, {
                    currentCenterId: User.currentCenterId,
                    id: this.seatId
                });
                editLandLine(data)
                    .then((res:any) => {
                        message.success("编辑成功", 2, () => {history.push(Routes.坐席分配.path)})
                    })
            }
        })
    };
    render(){
        const {form, memberList} = this.props;
        const {exNumberList, seatInfo, visible, msg} = this.state;
        const { getFieldDecorator } = form;
        return(
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div id="gym-telephone-land-line-add" className="gym-telephone-land-line-add page-wrap">
                    <Form >
                        <FormItem label={'用户名'}>
                            {
                                getFieldDecorator('tmkStaffId', {
                                    rules: [{required: true, message: '请输入用户名'},],
                                    initialValue: seatInfo.tmkStaffId
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
                                getFieldDecorator('phone', {
                                    initialValue: seatInfo.phone
                                })(
                                    <Input type={'text'} placeholder={``} />
                                )
                            }
                        </FormItem>
                        <FormItem label={'分机号'}>
                            {
                                getFieldDecorator('tmkAccountId', {
                                    rules: [{required: true, message: '请输入分机号'},],
                                    initialValue: seatInfo.tmkAccountId
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
                <Modal
                    visible={visible}
                    onCancel={this.close}
                    onOk={this.ok}
                    footer={null}
                >
                    <div className='text-c mb25'>
                        <p>{msg}</p>
                    </div>
                    <div className='text-c'>
                        <button className='gym-button-default gym-button-xs mr15' onClick={this.ok}>确认</button>
                        <button className='gym-button-white gym-button-xs mr15'onClick={this.close}>取消</button>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}

export {LandLineEdit}
