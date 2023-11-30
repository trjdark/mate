/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/12/4
 * Time: 下午3:57
 */
import React, {Fragment} from 'react';
import {Row, Col, Form, message} from "antd";
import {InputNumber, TextArea} from "../../../../component/input";
import {Select, Option} from "../../../../component/select";
import {form} from "@/common/decorator/form";
import {Routes} from "@/router/enum/routes";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {CancelButton} from "@/ui/component/cancelButton";
import {User} from "@/common/beans/user";
import {getCourseListByCourseType, updateChangeCenter, approvalChangeCenter} from "@redux-actions/contract";
import history from "../../../../../router/history";
import {connect} from "@/common/decorator/connect";
import {selectChangeCenterTypes, selectTransCenterType} from "@/saga/selectors/contract";
import {getAllCenter} from "@redux-actions/setting/center";
import {Thumbnail} from "@/ui/component/thumbnail";
import {UploadImg} from "@/ui/component/uploadImg";
import {Modal as MyModal} from "@/ui/component/customerCreateModal";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import {FUNC} from "@/ui/pages/setting/enum/functions";

const FormItem = Form.Item;

const changeTypes = [
    {
        code: 1,
        name: '全转'
    },{
        code: 0,
        name: '临转'
    },
];

declare interface OutContentProps {
    content:any,
    status:string,
    contractInfo:any,
    form?:any,
    changeCenterStatusList?:Array<any>,
    gbList?:Array<any>,
    gaList?:Array<any>
}
const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])

// 在职GB员工
const selectGBList = isPostTransRole ? {
    workingStatus: "1",
    roleList: ["GB","HGB"]
}:{
    workingStatus: "1",
    postName: ["GB","HGB"]
};
// 在职GA员工
const selectGAList = isPostTransRole ? {
    workingStatus: "1",
    roleList: ["GA","HGA"]
}:{
    workingStatus: "1",
    postName: ["GA","HGA"]
};

@connect((state:any) => ({
    changeCenterStatusList: selectChangeCenterTypes(state),
    transCenterTypes: selectTransCenterType(state),
    gbList: selectTotalEmployeeList(state, selectGBList),
    gaList: selectTotalEmployeeList(state, selectGAList),
}))
@form()
class ChangeCenter extends React.Component<OutContentProps, any>{
    state:any;
    constructor(props:any){
        super(props);
        this.state = {
            packageList: [],
            centerList:[],
            // 如果类型是全转的情况下
            isChangeNum: undefined, //课时数
            isChangePrice: undefined, //金额
            //转入审批时填写的 转入课时数
            rollInCourseNum: undefined,
            // 审批转入提示框开关
            visible: false
        }
    }
    componentDidMount(){
        getAllCenter({currentCenterId: User.currentCenterId})
            .then((res:any) => {
                const list = res.filter(item => (item.centerCode !=='HQ001' && item.centerCode !=='HQ002'));
                this.setState({
                    centerList: list
                })
            });

        getCourseListByCourseType({currentCenterId: User.currentCenterId})
            .then((res:any) => {
                this.setState({packageList: res})
            })
    }

    static getDerivedStateFromProps(props:any, state:any){
        if(props.content && props.transCenterTypes.length > 0){
            const transCenterTypes = props.transCenterTypes.filter((item:any) => item.codeValue === '全转');
            // 如果isChangeNum isChangePrice 为undefined（用来确认第一次修改），转课类型存在，并且为全转，则不能修改
            if( state.isChangeNum === undefined && state.isChangePrice === undefined &&  transCenterTypes.length > 0 && props.content.transferCenterType == transCenterTypes[0].code ){
                return {
                    isChangeNum: true,
                    isChangePrice: true
                }
            }
        }
        return null;
    }

    /**
     * 格式化转课类型
     * @param {number} type
     * @returns {string}
     */
    formatType = (type:number) => {
        const res = changeTypes.filter((item:any) => item.code === type);
        return res.length > 0 ? res[0].name : '-'
    };

    /**
     * 格式化审批状态
     * @param {string} status
     * @returns {string}
     */
    formatStatus = (status:string) => {
        const {changeCenterStatusList} = this.props;
        const outStatus = changeCenterStatusList.filter((item:any) => item.code === status);
        return outStatus.length > 0 ? outStatus[0].codeValue : '-'
    };
    /**
     * 审批转出申请
     * @param {string} value
     */
    approvalContract = (value:number) => {
        const {validateFields} = this.props.form;
        validateFields((err:any) => {
            if (!err) {
                const {content} = this.props;
                approvalChangeCenter({
                    approve: value,
                    id: content.id,
                    currentCenterId: User.currentCenterId,
                    contractId: content.contractId,
                }).then(() => {
                    message.success("审批成功");
                    history.push(Routes.合同操作列表转中心.path)
                })
            }
        })
    };
    /**
     * 审批转入申请
     * @param {string} value
     */
    approvalInput = (value:number) => {
        const {validateFields} = this.props.form;
        if(value == 0){
            const {content, form} = this.props;
            const {getFieldValue} = form;
            approvalChangeCenter({
                approve: value,
                id: content.id,
                currentCenterId: User.currentCenterId,
                contractId: content.contractId,
                primaryGAStaffId: getFieldValue('primaryGAStaffId'),
                primaryGBStaffId: getFieldValue('primaryGBStaffId'),
                rollInPackageId: getFieldValue('rollInPackageId'),
                rollInCourseNum: getFieldValue('rollInCourseNum')
            }).then(() => {
                message.success("审批通过");
                history.push(Routes.合同操作列表转中心.path)
            })
        }else{
            validateFields((err:any) => {
                if (!err) {
                    const {content, form} = this.props;
                    const {getFieldValue} = form;
                    approvalChangeCenter({
                        approve: value,
                        id: content.id,
                        currentCenterId: User.currentCenterId,
                        contractId: content.contractId,
                        primaryGAStaffId: getFieldValue('primaryGAStaffId'),
                        primaryGBStaffId: getFieldValue('primaryGBStaffId'),
                        rollInPackageId: getFieldValue('rollInPackageId'),
                        rollInCourseNum: getFieldValue('rollInCourseNum')
                    }).then(() => {
                        message.success("审批通过");
                        history.push(Routes.合同操作列表转中心.path)
                    })
                }
            })
        }

    };
    /**
     * 修改
     * @param e
     */
    handleSubmit = (e:any) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err:any, values) => {
            if(!err){
                updateChangeCenter(Object.assign({}, values, {
                    currentCenterId: User.currentCenterId,
                    contractId: this.props.content.contractId,
                    id: this.props.content.id,
                })).then(() => {
                    message.success("修改成功");
                    history.goBack()
                })
            }
        })
    };
    /**
     * 转入审批同意
     */
    handleApproveIn = () => {
        const {validateFields} = this.props.form;
        validateFields((err:any) => {
            if(!err){
                this.setState({visible: true})
            }
        })
    };
    /**
     * 请选择转课类型
     */
    onSelectType = (value:number) => {
        const {content = {}} = this.props;
        const {contract} = content;
        const {setFieldsValue} = this.props.form;
        if(value === 1){
            setFieldsValue({
                rollOutCourseNum: contract.remainingCourseNum - (contract.remainingFreeCourseNum || 0),
                rollOutPackageCoursePrice: content.contract.remainingCoursePrice
            });
            this.setState({
                isChangeNum:true,
                isChangePrice:true
            })
        }else{
            this.setState({
                isChangeNum:false,
                isChangePrice:false
            })
        }
    };
    /**
     * 上传图片
     */
    handleUploadImg = (file:any, fileList:Array<any>) => {
        const {setFieldsValue} = this.props.form;
        setFieldsValue({attachmentList: fileList.map((item:any) => item.response.data)})
    };
    /**
     * 搜索框，输入过滤
     * @param input
     * @param option
     * @returns {boolean}
     */
    filter = (input, option) => {
        return option.props.children.indexOf(input) >= 0;
    };

    render(){
        const {content = {}, status, form, gaList, gbList} = this.props;
        const {contract = {}} = content;
        const {getFieldDecorator, getFieldValue} = form;
        const {centerList, isChangeNum, isChangePrice, packageList, visible} = this.state;
        const fileList = (content.attachmentList || []).map((item:any) => ({
            url:`${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${item.photoPath}&token=${User.getToken}`,
            status: 'done',
            uid: item.id,
            name: item.photoName,
            response: Object.assign({}, {}, {data: item})
        }));
        return(
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-thead-left gym-contract-table-thead-right'>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-thead-left gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>转课类型:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-thead-left'>
                                    <span>转课类型:</span>
                                </Col>
                        }
                        <Col span={8} className='gym-contract-table-tbody-form'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('transferCenterType',{
                                                rules: [
                                                    {required: true, message:'请选择转课类型'}
                                                ],
                                                initialValue:content.transferCenterType
                                            })(
                                                <Select
                                                    onChange={this.onSelectType}
                                                    placeholder='请选择'
                                                >
                                                    {
                                                        changeTypes.map((item:any) =>
                                                            <Option key={`type_${item.id}`} value={item.code}>
                                                                {item.name}
                                                            </Option>
                                                        )
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                    : <FormItem className='gym-act-modal-form'>
                                        {this.formatType(content.transferCenterType)}
                                    </FormItem>
                            }
                        </Col>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>审批状态:</span>
                        </Col>
                        <Col span={8}
                             className='gym-contract-table-tbody-value gym-contract-table-thead-right'>
                            <span>{this.formatStatus(content.approvalStatus)}</span>
                        </Col>
                    </Row>
                    <Row className='gym-contract-table-tbody'>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>转出中心:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-value'>
                            <span>{`${content.outCenterCode}-${content.outCenterName}`}</span>
                        </Col>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>转入中心:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-label'>
                                    <span>转入中心:</span>
                                </Col>
                        }
                        <Col span={8} className='gym-contract-table-tbody-form'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator("rollInCenterId", {
                                                rules: [
                                                    {required: true, message:'请选择转入中心'}
                                                ],
                                                initialValue: content.rollInCenterId
                                            })(
                                                <Select
                                                    showSearch={true}
                                                    filterOption={(input, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                >
                                                    {
                                                        centerList.map((item:any) =>
                                                            <Option key={item.id} value={item.id}>
                                                                {`${item.centerCode}-${item.centerName}`}
                                                            </Option>
                                                        )
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                    : <FormItem className='gym-act-modal-form'>
                                        {`${content.rollInCenterCode}-${content.rollInCenterName}`}
                                    </FormItem>
                            }
                        </Col>
                    </Row>
                    <Row className='gym-contract-table-tbody'>
                        <Col span={4} className={`gym-contract-table-tbody-label ${status === "edit" ? 'gym-contract-table-required-label' : ''}`}>
                            {status === "edit" && <span className='gym-contract-table-required'>*</span>}
                            <span>转出金额:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-form'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('rollOutPackageCoursePrice', {
                                                rules: [
                                                    {required: true, message:'请输入转出金额'}
                                                ],
                                                initialValue: content.rollOutCourseAmount,
                                            })(
                                                <InputNumber disabled={isChangePrice} min={0} placeholder='请输入'/>
                                            )
                                        }
                                    </FormItem>
                                    : <FormItem className='gym-act-modal-form'>
                                        {content.rollOutCourseAmount && content.rollOutCourseAmount.toFixed(2)}
                                    </FormItem>
                            }
                        </Col>
                        {
                            status === "approve-in" &&
                                <Fragment>
                                    <Col span={4} className='gym-contract-table-tbody-label'>
                                        <span>转出课时:</span>
                                    </Col>
                                    <Col span={8}
                                         className='gym-contract-table-tbody-value gym-contract-table-thead-right'>
                                        <span>{content.rollOutCourseNum}</span>
                                    </Col>
                                </Fragment>
                        }
                    </Row>
                    {
                        status === "view"&&
                        <Fragment>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4} className='gym-contract-table-tbody-label'>
                                    <span>转入GB:</span>
                                </Col>
                                <Col span={8} className='gym-contract-table-tbody-form'>
                                    <FormItem className='gym-act-modal-form'>
                                        {content.primaryGBName}
                                    </FormItem>
                                </Col>
                                <Col span={4} className='gym-contract-table-tbody-label'>
                                    <span>转入GA:</span>
                                </Col>
                                <Col span={8} className='gym-contract-table-tbody-form'>
                                    <FormItem className='gym-act-modal-form'>
                                        {content.primaryGAName}
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4} className='gym-contract-table-tbody-label'>
                                    <span>转出课时:</span>
                                </Col>
                                <Col span={8} className='gym-contract-table-tbody-form'>
                                    <FormItem className='gym-act-modal-form'>
                                        {content.rollOutCourseNum}
                                    </FormItem>
                                </Col>
                                <Col span={4} className='gym-contract-table-tbody-label'>
                                    <span>转入课时:</span>
                                </Col>
                                <Col span={8} className='gym-contract-table-tbody-form'>
                                    <FormItem className='gym-act-modal-form'>
                                        {content.rollInCourseNum}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Fragment>

                    }
                    {
                        status === "approve" &&
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4} className='gym-contract-table-tbody-label'>
                                    <span>转出课时:</span>
                                </Col>
                                <Col span={12} className='gym-contract-table-tbody-form'>
                                    <FormItem className='gym-act-modal-form'>
                                        {content.rollOutCourseNum}
                                    </FormItem>
                                </Col>
                            </Row>
                    }
                    {
                        (status === "approve-in")
                            ?
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span><span>转入GB:</span>
                                </Col>
                                <Col span={8} className='gym-contract-table-tbody-form'>
                                    {
                                        content.primaryGBId  && content.primaryGBId  !== '' &&
                                        <FormItem className='gym-act-modal-form'>
                                            {
                                                getFieldDecorator('primaryGBStaffId', {
                                                    rules: [
                                                        {required: true, message:'请输入GB'}
                                                    ],
                                                    initialValue: content.primaryGBId
                                                })(
                                                    <Select
                                                        showSearch
                                                        optionFilterProp="children"
                                                        filterOption={(input, option) => this.filter(input, option)}
                                                    >
                                                        {
                                                            gbList.map((item:any) =>
                                                                <Option key={item.staffId} value={item.staffId}>{item.userName}</Option>
                                                            )
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    }
                                    {
                                        !content.primaryGBId  &&
                                        <FormItem className='gym-act-modal-form'>
                                            {
                                                getFieldDecorator('primaryGBStaffId', {
                                                    rules: [
                                                        {required: true, message:'请输入GB'}
                                                    ]
                                                })(
                                                    <Select
                                                        showSearch
                                                        optionFilterProp="children"
                                                        filterOption={(input, option) => this.filter(input, option)}
                                                    >
                                                        {
                                                            gbList.map((item:any) =>
                                                                <Option key={item.staffId} value={item.staffId}>{item.userName}</Option>
                                                            )
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    }
                                </Col>
                                <Col span={4} className='gym-contract-table-tbody-label'>
                                    <span>转入GA:</span>
                                </Col>
                                <Col span={8} className='gym-contract-table-tbody-form'>
                                    {
                                        content.primaryGAId  && content.primaryGAId  !== '' &&
                                        <FormItem className='gym-act-modal-form'>
                                            {
                                                getFieldDecorator('primaryGAStaffId',{
                                                    initialValue: content.primaryGAId
                                                })(
                                                    <Select
                                                        showSearch
                                                        optionFilterProp="children"
                                                        filterOption={(input, option) => this.filter(input, option)}
                                                    >
                                                        {
                                                            gaList.map((item:any) =>
                                                                <Option key={item.staffId} value={item.staffId}>{item.userName}</Option>
                                                            )
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    }
                                    {
                                        !content.primaryGAId  &&
                                        <FormItem className='gym-act-modal-form'>
                                            {
                                                getFieldDecorator('primaryGAStaffId')(
                                                    <Select
                                                        showSearch
                                                        optionFilterProp="children"
                                                        filterOption={(input, option) => this.filter(input, option)}
                                                    >
                                                        {
                                                            gaList.map((item:any) =>
                                                                <Option key={item.staffId} value={item.staffId}>{item.userName}</Option>
                                                            )
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    }

                                </Col>
                            </Row>
                            : (status !== "approve-in" && status !== "approve" && status !== "view") &&
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4} className={`gym-contract-table-tbody-label ${status === "edit" ? 'gym-contract-table-required-label' : ''}`}>
                                    {status === "edit" && <span className='gym-contract-table-required'>*</span>}
                                    <span>转出课时:</span>
                                </Col>
                                <Col span={8} className='gym-contract-table-tbody-form'>
                                    {
                                        status === "edit"
                                            ? <FormItem className='gym-act-modal-form'>
                                                {
                                                    getFieldDecorator('rollOutCourseNum', {
                                                        initialValue: content.rollOutCourseNum || (content.remainingCourseNum - (content.remainingFreeCourseNum || 0)),
                                                        rules: [
                                                            {required: true, message:'请输入转出课时'}
                                                        ]
                                                    })(
                                                        <InputNumber
                                                            min={1}
                                                            precision={0}
                                                            max={contract.remainingCourseNum - (contract.remainingFreeCourseNum || 0) || undefined}
                                                            disabled={isChangeNum}
                                                            placeholder='请输入'
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                            : <FormItem className='gym-act-modal-form'>
                                                {content.rollOutCourseNum}
                                            </FormItem>
                                    }
                                </Col>
                            </Row>
                    }
                    {/*{*/}
                        {/*status === 'approve-in' && contract.businessSource === '75001'&&*/}
                        {/*<Row className='gym-contract-table-tbody'>*/}
                            {/*<Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>*/}
                                {/*<span className='gym-contract-table-required'>*</span><span>转入课程包名称:</span>*/}
                            {/*</Col>*/}
                            {/*<Col span={8} className='gym-contract-table-tbody-form'>*/}
                                {/*{*/}
                                    {/*content.rollInPackageID && content.rollInPackageID !== '' &&*/}
                                    {/*<FormItem className='gym-act-modal-form'>*/}
                                        {/*{*/}
                                            {/*getFieldDecorator('rollInPackageId', {*/}
                                                {/*rules: [*/}
                                                    {/*{required: true, message:'请输入课程包名称'}*/}
                                                {/*],*/}
                                                {/*initialValue: content.rollInPackageID*/}
                                            {/*})(*/}
                                                {/*<Select*/}
                                                    {/*className='gym-form-item-select'*/}
                                                {/*>*/}
                                                    {/*{*/}
                                                        {/*packageList.*/}
                                                        {/*filter((item:any) => item.businessSource === "75001")*/}
                                                        {/*.map((item:any) =>*/}
                                                            {/*<Option*/}
                                                                {/*key={`pay_type_${item.id}`}*/}
                                                                {/*value={item.id}*/}
                                                            {/*>{item.packageName}*/}
                                                            {/*</Option>*/}
                                                        {/*)*/}
                                                    {/*}*/}
                                                {/*</Select>*/}
                                            {/*)*/}
                                        {/*}*/}
                                    {/*</FormItem>*/}
                                {/*}*/}
                                {/*{*/}
                                    {/*!content.rollInPackageID &&*/}
                                    {/*<FormItem className='gym-act-modal-form'>*/}
                                        {/*{*/}
                                            {/*getFieldDecorator('rollInPackageId', {*/}
                                                {/*rules: [*/}
                                                    {/*{required: true, message:'请输入课程包名称'}*/}
                                                {/*],*/}
                                            {/*})(*/}
                                                {/*<Select*/}
                                                    {/*className='gym-form-item-select'*/}
                                                {/*>*/}
                                                    {/*{*/}
                                                        {/*packageList.*/}
                                                        {/*filter((item:any) => item.businessSource === "75001").*/}
                                                        {/*map((item:any) =>*/}
                                                            {/*<Option*/}
                                                                {/*key={`pay_type_${item.id}`}*/}
                                                                {/*value={item.id}*/}
                                                            {/*>{item.packageName}*/}
                                                            {/*</Option>*/}
                                                        {/*)*/}
                                                    {/*}*/}
                                                {/*</Select>*/}
                                            {/*)*/}
                                        {/*}*/}
                                    {/*</FormItem>*/}
                                {/*}*/}
                            {/*</Col>*/}
                            {/*<Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>*/}
                                {/*<span className='gym-contract-table-required'>*</span>*/}
                                {/*<span>转入课时:</span>*/}
                            {/*</Col>*/}
                            {/*<Col span={8} className='gym-contract-table-tbody-form'>*/}
                                {/*<FormItem className='gym-act-modal-form'>*/}
                                    {/*{*/}
                                        {/*getFieldDecorator('rollInCourseNum',{*/}
                                            {/*rules: [*/}
                                                {/*{required: true, message:'请输入转入课时'}*/}
                                            {/*],*/}
                                        {/*})(<InputNumber*/}
                                            {/*min={1}*/}
                                            {/*precision={0}*/}
                                            {/*placeholder='请输入'/>)*/}
                                    {/*}*/}
                                {/*</FormItem>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                    {/*}*/}
                    {/*{*/}
                        {/*status === 'approve-in' && contract.businessSource === '75002' &&*/}
                        {/*<Row className='gym-contract-table-tbody'>*/}
                            {/*<Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>*/}
                                {/*<span className='gym-contract-table-required'>*</span><span>转入课程包名称:</span>*/}
                            {/*</Col>*/}
                            {/*<Col span={8} className='gym-contract-table-tbody-form'>*/}
                                {/*{*/}
                                    {/*content.rollInPackageID && content.rollInPackageID !== '' &&*/}
                                    {/*<FormItem className='gym-act-modal-form'>*/}
                                        {/*{*/}
                                            {/*getFieldDecorator('rollInPackageId', {*/}
                                                {/*rules: [*/}
                                                    {/*{ required: true, message: '请输入课程包名称' }*/}
                                                {/*],*/}
                                                {/*initialValue: content.rollInPackageID*/}
                                            {/*})(*/}
                                                {/*<Select*/}
                                                    {/*className='gym-form-item-select'*/}
                                                {/*>*/}
                                                    {/*{*/}
                                                        {/*packageList.*/}
                                                            {/*filter((item: any) => item.businessSource === "75002")*/}
                                                            {/*.map((item: any) =>*/}
                                                                {/*<Option*/}
                                                                    {/*key={`pay_type_${item.id}`}*/}
                                                                    {/*value={item.id}*/}
                                                                {/*>{item.packageName}*/}
                                                                {/*</Option>*/}
                                                            {/*)*/}
                                                    {/*}*/}
                                                {/*</Select>*/}
                                            {/*)*/}
                                        {/*}*/}
                                    {/*</FormItem>*/}
                                {/*}*/}
                                {/*{*/}
                                    {/*!content.rollInPackageID &&*/}
                                    {/*<FormItem className='gym-act-modal-form'>*/}
                                        {/*{*/}
                                            {/*getFieldDecorator('rollInPackageId', {*/}
                                                {/*rules: [*/}
                                                    {/*{ required: true, message: '请输入课程包名称' }*/}
                                                {/*],*/}
                                            {/*})(*/}
                                                {/*<Select*/}
                                                    {/*className='gym-form-item-select'*/}
                                                {/*>*/}
                                                    {/*{*/}
                                                        {/*packageList.*/}
                                                            {/*filter((item: any) => item.businessSource === "75002").*/}
                                                            {/*map((item: any) =>*/}
                                                                {/*<Option*/}
                                                                    {/*key={`pay_type_${item.id}`}*/}
                                                                    {/*value={item.id}*/}
                                                                {/*>{item.packageName}*/}
                                                                {/*</Option>*/}
                                                            {/*)*/}
                                                    {/*}*/}
                                                {/*</Select>*/}
                                            {/*)*/}
                                        {/*}*/}
                                    {/*</FormItem>*/}
                                {/*}*/}
                            {/*</Col>*/}
                            {/*<Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>*/}
                                {/*<span className='gym-contract-table-required'>*</span>*/}
                                {/*<span>转入课时:</span>*/}
                            {/*</Col>*/}
                            {/*<Col span={8} className='gym-contract-table-tbody-form'>*/}
                                {/*<FormItem className='gym-act-modal-form'>*/}
                                    {/*{*/}
                                        {/*getFieldDecorator('rollInCourseNum', {*/}
                                            {/*rules: [*/}
                                                {/*{ required: true, message: '请输入转入课时' }*/}
                                            {/*],*/}
                                        {/*})(<InputNumber*/}
                                            {/*min={1}*/}
                                            {/*precision={0}*/}
                                            {/*placeholder='请输入' />)*/}
                                    {/*}*/}
                                {/*</FormItem>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                    {/*}*/}
                    {
                        status === 'approve-in' &&
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                <span className='gym-contract-table-required'>*</span><span>转入课程包名称:</span>
                            </Col>
                            <Col span={8} className='gym-contract-table-tbody-form'>
                                {
                                    content.rollInPackageID && content.rollInPackageID !== '' &&
                                    <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('rollInPackageId', {
                                                rules: [
                                                    {required: true, message:'请输入课程包名称'}
                                                ],
                                                initialValue: content.rollInPackageID
                                            })(
                                                <Select
                                                    className='gym-form-item-select'
                                                >
                                                    {
                                                        packageList.
                                                        filter((item:any) => item.businessSource === contract.businessSource)
                                                            .map((item:any) =>
                                                                <Option
                                                                    key={`pay_type_${item.id}`}
                                                                    value={item.id}
                                                                >{item.packageName}
                                                                </Option>
                                                            )
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                }
                                {
                                    !content.rollInPackageID &&
                                    <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('rollInPackageId', {
                                                rules: [
                                                    {required: true, message:'请输入课程包名称'}
                                                ],
                                            })(
                                                <Select
                                                    className='gym-form-item-select'
                                                >
                                                    {
                                                        packageList.
                                                        filter((item:any) => item.businessSource === contract.businessSource).
                                                        map((item:any) =>
                                                            <Option
                                                                key={`pay_type_${item.id}`}
                                                                value={item.id}
                                                            >{item.packageName}
                                                            </Option>
                                                        )
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                }
                            </Col>
                            <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                <span className='gym-contract-table-required'>*</span>
                                <span>转入课时:</span>
                            </Col>
                            <Col span={8} className='gym-contract-table-tbody-form'>
                                <FormItem className='gym-act-modal-form'>
                                    {
                                        getFieldDecorator('rollInCourseNum',{
                                            rules: [
                                                {required: true, message:'请输入转入课时'}
                                            ],
                                        })(<InputNumber
                                            min={1}
                                            precision={0}
                                            placeholder='请输入'/>)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    }
                    <Row className='gym-contract-table-tbody'>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-form-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>转中心原因说明:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-form-label'>
                                    <span>转中心原因说明:</span>
                                </Col>
                        }
                        <Col span={20} className='gym-contract-table-tbody-form-value'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('remark',{
                                                rules: [
                                                    {required: true, message:'请输入原因说明'}
                                                ],
                                                initialValue:content.remark
                                            })(
                                                <TextArea
                                                    style={{width:'650px'}}
                                                    placeholder='请输入原因说明'
                                                    minLength={5}
                                                    autosize={{minRows: 2, maxRows: 3}}
                                                />
                                            )
                                        }
                                    </FormItem>
                                    : <span className='gym-act-modal-form'>
                                        {content.remark}
                                    </span>
                            }
                        </Col>
                    </Row>
                    <Row
                        className='gym-contract-table-tbody gym-contract-table-tbody-left gym-contract-table-tbody-right'>
                        <Col span={4}
                             className='gym-contract-table-tbody-form-label gym-contract-table-tbody-left gym-contract-table-tbody-form-attachment'>
                            <span>附件:</span>
                        </Col>
                        <Col span={20}
                             className='gym-contract-table-tbody-form-value gym-contract-table-tbody-right'>
                            {
                                status === "edit"
                                    ? <FormItem className='span'>
                                        {
                                            getFieldDecorator('attachmentList',{
                                                initialValue:content.attachmentList
                                            })(<span/>)
                                        }
                                        <UploadImg fileList={fileList} onChange={this.handleUploadImg} maxFileLength={5}/>
                                    </FormItem>
                                    :<FormItem className='gym-act-modal-form'>
                                        {
                                            (content.attachmentList || []).map((item:any) =>
                                                <Thumbnail key={item.id} imgSrc={`${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${item.photoPath}&token=${User.getToken}`}/>
                                            )
                                        }
                                    </FormItem>
                            }
                        </Col>
                    </Row>

                    {
                        status === 'edit' &&
                        <CancelButton
                            form={form}
                            submitText='提交'
                        />
                    }
                </Form>
                {
                    status === 'approve' &&
                    <Row>
                        <div className='gym-contract-table-bottoms'>
                            <ConfirmCheck
                                contentText={"确认同意此申请？"}
                                item={{}}
                                ensure={() => this.approvalContract(1)}
                                button={<button className='gym-button-default gym-button-xs gym-contract-table-bottoms-button'>同意</button>}
                            />
                            <ConfirmCheck
                                contentText={"确认不同意此申请？"}
                                item={{}}
                                ensure={() => this.approvalContract(0)}
                                button={<button className='gym-button-white gym-button-xs gym-contract-table-bottoms-button'>不同意</button>}
                            />
                        </div>
                    </Row>
                }
                {
                    status === 'approve-in' &&
                    <Row>
                        <div className='gym-contract-table-bottoms'>
                            <Fragment>
                                <MyModal
                                    visible={visible}
                                    handleOk={() => {
                                        this.approvalInput(1);
                                        this.setState({visible: false})
                                    }}
                                    handleCancel={() => this.setState({visible: false})}
                                    contentText={
                                        <p className='size14'>本次合同转中心的<span style={{color: '#009cbd'}}>{`转入课时为${getFieldValue('rollInCourseNum') || 0}节，金额为${content.rollOutCourseAmount}元`}</span>，请注意转出和转入的课时差异，确认之后将无法修改。</p>
                                    }
                                />
                                <button className='gym-button-default gym-button-xs gym-contract-table-bottoms-button' onClick={this.handleApproveIn}>同意</button>
                            </Fragment>
                            <ConfirmCheck
                                contentText={"确认拒绝此申请？"}
                                item={{}}
                                ensure={() => this.approvalInput(0)}
                                button={<button className='gym-button-white gym-button-xs gym-contract-table-bottoms-button'>不同意</button>}
                            />
                        </div>
                    </Row>
                }
            </div>

        )
    }
}

export {ChangeCenter};
