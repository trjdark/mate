/**
 * desc: 合同详情
 * User: colin.lu
 * Date: 2018/10/30
 * Time: 下午16:00
 */

import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PageTitle} from "@/ui/component/pageTitle";
import {Scrollbars} from 'react-custom-scrollbars';
import {CommonUtils} from "@/common/utils/commonUtils";
import history from '../../../../router/history';
import {Routes} from "@/router/enum/routes";
import {getContractInfo, invalidContract, getPriority, settingPriority} from "@redux-actions/contract";
import {User} from "@/common/beans/user";
import {BasicContractInfo} from './part/basicContractInfo';
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {
    selectContractApprovalStatus, selectPaymentStatus,
    selectContractTypes,selectContractReviseStatus, selectContractReviseType
} from "@/saga/selectors/contract";
import {connect} from "@/common/decorator/connect";
import {ChangeCenter} from "./part/changeCenter";
import {ApplyLeave} from "./part/applyLeave";
import {ChangePackage} from "./part/changePackage";
import {GiveClass} from "./part/giveClass";
import {Delay} from "./part/delay";
import {CancelClass} from "./part/cancelClass";
import {Uaged} from "./part/uaged";
import {Icon} from "@/ui/component/icon";
import { message, Modal } from 'antd';
import {ReviseContract} from "@/ui/pages/contract/management/part/reviseContract";
import { FUNC } from "@/ui/pages/setting/enum/functions";
import {PartRefund} from "@/ui/pages/contract/management/part/partRefund";

@connect((state:any) => ({
    approvalStatus: selectContractApprovalStatus(state),
    paymentStatus: selectPaymentStatus(state),
    contractTypes: selectContractTypes(state),
    reviseStatus: selectContractReviseStatus(state),
    reviseTypes: selectContractReviseType(state),
}))
class ContractInfo extends React.Component<any, any> {
    scrollContent:any;
    contractCode:string;
    contractId:string;
    effectiveTime:any;
    private COURSE_TIME_TYPE = [0,3];
    private tabs = [
        '基本信息',
        '使用情况',
        '转中心',
        '改课程包',
        '赠课',
        '修改请假次数',
        '合同延期',
        '退课',
    ];
    private routes:Array<any> = [
        {
            name: '合同',
            path: '',
            link: '#',
            id: 'contract'
        },{
            name: '合同管理',
            path: '',
            link: '#',
            id: 'contractManagement'
        },{
            name: '查看合同',
            path: '',
            link: '#',
            id: 'contractManagementApprovalFlow'
        }
    ];

    constructor(props: any) {
        super(props);
        if(CommonUtils.hasParams(props)){
            this.contractCode = CommonUtils.parse(props).contractCode;
            this.contractId = CommonUtils.parse(props).contractId;
        }else{
            history.push(Routes.合同管理列表.path)
        }
        this.state = {
            tabsIndex: 0,
            itemsHeight: [],
            contractInfo: {},
            changeCenterList: [],
            freeList:[],
            delayList: [],
            leaveList: [],
            changePkgList: [],
            cancelList: [],
            reviseList: [],
            partRefundList: [],
            usage: [],
            isOpe: {},
            // 实际课包信息
            courseInfo: {},
            scrollH: window.innerHeight - 180,
            rangeTime: '',
            firstDeductionModal: false
        }
    }
    componentDidMount() {
        this.getContractInfo()
        window.addEventListener('resize', this.onResize);
    };

    /**
     * 获取合同信息
     */
    getContractInfo = ()=>{
        getContractInfo({
            currentCenterId: User.currentCenterId,
            contractCode: this.contractCode,
            contractId: this.contractId,
            id: this.contractId
        }, true).then((res:any) => {
            this.setState({
                contractInfo: res.detail,
                changeCenterList: res.changeCenterList.list,
                freeList: res.freeList.list,
                delayList: res.delayList.list,
                leaveList: res.leaveList.list,
                changePkgList: res.changePkgList.list,
                cancelList: res.cancelList.list,
                usage: res.usageDetail,
                isOpe: res.isOper,
                courseInfo: res.courseInfo,
                reviseList: res.reviseList,
                partRefundList: res.partRefundList
            });
            if(res.partRefundList.length > 0 ||  res.isOper.contractPartRefundFlag){
                this.tabs.push('部分退费');
            }
            if(User.permissionList.includes(FUNC['申请合同调整']) &&
                !this.COURSE_TIME_TYPE.includes(res.detail.packageType)){
                this.tabs.push('合同调整')
            }
        });
    }
    onResize = () => {
        this.setState({scrollH: window.innerHeight - 100})

    };
    // todo
    static getDerivedStateFromProps(props, state){
        let arr = [];
        const elelist:any = document.getElementsByClassName('gym-contract-info-wrap');
        for(let i = 0, l = elelist.length; i < l; i++){
            arr = [...arr, elelist[i].offsetTop - 5]
        }
        return {itemsHeight: arr}
    }

    /**
     * 切换tab
     * @param {number} index
     */
    changeTab = (index:number) => {
        this.setState({tabsIndex:index});
        const elm:any = document.getElementsByClassName('gym-contract-info-wrap')[index];
        this.scrollContent.scrollTop(elm.offsetTop)
    };
    /**
     * 监听信息页面滚动
     * @param e
     */
    scroll = (e) => {
        const {itemsHeight} = this.state;
        const top = e.target.scrollTop;
        const px = 40;
        switch (true){
            case top < itemsHeight[1] - px && top > itemsHeight[0] - px:
                this.setState({tabsIndex: 0})
                break;
            case top < itemsHeight[2] - px && top >= itemsHeight[1] - px:
                this.setState({tabsIndex: 1})
                break;
            case top < itemsHeight[3] - px && top >= itemsHeight[2] - px:
                this.setState({tabsIndex: 2})
                break;
            case top < itemsHeight[4] - px && top >= itemsHeight[3] - px:
                this.setState({tabsIndex: 3})
                break;
            case top < itemsHeight[5] - px && top >= itemsHeight[4] - px:
                this.setState({tabsIndex: 4})
                break;
            case top < itemsHeight[6] - px && top >= itemsHeight[5] - px:
                this.setState({tabsIndex: 5})
                break;
            case top < itemsHeight[7] - px && top >= itemsHeight[6] - px:
                this.setState({tabsIndex: 6});
                break;
            case top < itemsHeight[8] - px && top >= itemsHeight[7] - px:
                this.setState({tabsIndex: 7});
                break;
            case top >= itemsHeight[8] - px:
                this.setState({tabsIndex: 8})
                break;
        }
    }
    /**
     * 作废合同
     */
    cancelContract = (data:any) => {
        const {contractInfo} = this.state;
        invalidContract({contractId: contractInfo.contractId, currentCenterId: User.currentCenterId})
            .then((res:any) => {
                history.push(Routes.合同管理列表.path)
            })
    };
    /**
     * 设置C端优先扣课
     */
    setConsume = () => {
        const {contractInfo} = this.state;
        // 如果不在app展示，则不能设施优先扣课
        if(!contractInfo.isGymAppShow){
            return;
        }
        const params = {
            contractId:contractInfo.contractId,
            businessSource:contractInfo.businessSource,
            leadsId:contractInfo.leadsId,
            currentCenterId:User.currentCenterId
        };
        if(contractInfo.priority === 0){
            getPriority(params).then(res => {
                res.priority
                    ? this.setState({firstDeductionModal:!this.state.firstDeductionModal})
                    : settingPriority({...params, isSetting:1
                    }).then(() => {
                        message.success('设置成功')
                        this.getContractInfo()
                    })
            })
        }else if(contractInfo.priority === 1){
            settingPriority({
                ...params,
                isSetting:0
            }).then(()=>{
                message.success('设置成功')
                this.getContractInfo()
            })
        }
    };
    render() {
        const {
            tabsIndex, contractInfo, changeCenterList,
            freeList, delayList, leaveList, changePkgList,
            cancelList, usage, isOpe, scrollH, courseInfo,firstDeductionModal,
            reviseList, partRefundList
        } = this.state;
        const {approvalStatus, paymentStatus, contractTypes, reviseStatus, reviseTypes} = this.props;
        const APPROVED = approvalStatus.filter((item:any) => item.codeValue === '已通过')[0] && approvalStatus.filter((item:any) => item.codeValue === '已通过')[0].code;
        const UNPAID = paymentStatus.filter((item:any) => item.codeValue === '未付款')[0] && paymentStatus.filter((item:any) => item.codeValue === '未付款')[0].code;
        const FREE = contractTypes.filter((item:any) => item.codeValue === '赠送')[0] && contractTypes.filter((item:any) => item.codeValue === '赠送')[0].code;
        const {isPartReturnCenter} = User.tmkStatus;
        return (
            <div id={`gym-contract-info`}>
                <BreadCrumb routes={this.routes} />
                <div className='page-wrap no-padding'>
                    <ul className='gym-contract-info-nav'>
                        {
                            this.tabs.map((item:any, index:number) =>
                                <li
                                    key={`tabs_${index}`}
                                    className={`gym-contract-info-nav-item ${index === tabsIndex && 'active'}`}
                                    onClick={() => this.changeTab(index)}
                                >
                                    {item}
                                </li>)
                        }
                        {
                            // 已通过审批并且未做收款确认
                            (
                                (contractInfo.approvalStatus === APPROVED || contractInfo.approvalStatus==='19003')&&
                                contractInfo.paymentStatus === UNPAID &&
                                (isOpe && isOpe.contractDelFlag)) &&
                                contractInfo.contractSource !== "74001" &&
                            <li className='gym-contract-info-nav-cancel'>
                                <ConfirmCheck
                                    button={<button className='gym-contract-info-nav-cancel-button'>合同作废</button>}
                                    item={contractInfo}
                                    contentText={"是否作废此合同？"}
                                    ensure={this.cancelContract}
                                />
                            </li>
                        }
                    </ul>
                    <Scrollbars
                        ref={(ref:any) => this.scrollContent = ref}
                        className='gym-contract-info'
                        autoHide={true}
                        universal={true}
                        autoHeightMin={scrollH}
                        autoHeight={true}
                        onScroll={this.scroll}
                    >
                        <div className='gym-contract-info-wrap mt30'>
                            <div className='gym-page-title'>
                                <div className='gym-page-title-wrap c333'>
                                    <Icon className='gym-page-title-icon' type='biaoti'/>
                                    基本信息{
                                    contractInfo.priority === 1 ?  <span style={{fontSize:"12px",color:"#009cbd"}}>C端优先扣课</span> : ''
                                }
                                    {
                                        <button className={`gym-button-lg ${contractInfo.isGymAppShow ? 'gym-button-default' : 'gym-button-greyb'}`}
                                                style={{position:"absolute",right:'.5rem'}} onClick={this.setConsume}>{
                                            contractInfo.priority === 1
                                                ? '取消C端优先扣课'
                                                : contractInfo.priority === 0
                                                ? 'C端优先扣课'
                                                : contractInfo.priority
                                        }</button>
                                    }
                                </div>
                            </div>
                            <BasicContractInfo
                                contractInfo={contractInfo}
                                emitNext={(records)=>{
                                    this.setState(preState => {
                                        return {
                                            contractInfo:Object.assign(preState.contractInfo,{records})
                                        }
                                    })
                                }}
                            />
                        </div>

                        <div className='gym-contract-info-wrap mt30'>
                            <PageTitle title={`使用情况`}/>
                            <Uaged list={usage}/>
                        </div>
                        <ChangeCenter
                            contractId={contractInfo.contractId}
                            aStatus={contractInfo.approvalStatus}
                            pStatus={contractInfo.paymentStatus}
                            contractCode={contractInfo.contractCode}
                            list={changeCenterList}
                            // 有申请权限，课程包非赠送课程包，非课时产品 临转无法再转中心
                            isOpe={
                                isOpe &&
                                isOpe.transferCenterOperFlag &&
                                contractInfo.contractType !== FREE &&
                                !this.COURSE_TIME_TYPE.includes(contractInfo.packageType) &&
                                contractInfo.approvalStatus === APPROVED
                            }
                        />
                        <ChangePackage
                            // 需要知道改之前的课包有效期
                            signTime={contractInfo.signTime}
                            contractId={contractInfo.contractId}
                            contractCode={contractInfo.contractCode}
                            price={contractInfo.totalCoursePrice}
                            effectiveTime={contractInfo.effectiveTime}
                            reallyAfterDiscountPrice={courseInfo.courseAmount}
                            aStatus={contractInfo.approvalStatus}
                            pStatus={contractInfo.paymentStatus}
                            list={changePkgList}
                            isOpe={
                                isOpe &&
                                isOpe.modifyPackageOperFlag &&
                                contractInfo.contractType !== FREE &&
                                !this.COURSE_TIME_TYPE.includes(contractInfo.packageType) &&
                                contractInfo.approvalStatus === APPROVED}
                        />
                        <GiveClass
                            contractId={contractInfo.contractId}
                            contractCode={contractInfo.contractCode}
                            aStatus={contractInfo.approvalStatus}
                            pStatus={contractInfo.paymentStatus}
                            list={freeList}
                            isOpe={
                                isOpe &&
                                isOpe.freeCourseRecordOperFlag &&
                                contractInfo.contractType !== FREE &&
                                !this.COURSE_TIME_TYPE.includes(contractInfo.packageType) &&
                                contractInfo.approvalStatus === APPROVED
                                }
                        />
                        <ApplyLeave
                            contractId={contractInfo.contractId}
                            contractCode={contractInfo.contractCode}
                            aStatus={contractInfo.approvalStatus}
                            pStatus={contractInfo.paymentStatus}
                            list={leaveList}
                            isOpe={
                                isOpe &&
                                isOpe.modifyLeaveTimesOperFlag &&
                                contractInfo.contractType !== FREE &&
                                contractInfo.approvalStatus === APPROVED &&
                                !this.COURSE_TIME_TYPE.includes(contractInfo.packageType)
                            }
                        />
                        <Delay
                            endTime={contractInfo.endTime}
                            contractCode={contractInfo.contractCode}
                            contractId={contractInfo.contractId}
                            aStatus={contractInfo.approvalStatus}
                            pStatus={contractInfo.paymentStatus}
                            list={delayList}
                            // 有申请权限， mate7710去掉赠送合同和课时产品的限制
                            isOpe={
                                isOpe &&
                                isOpe.contractExtentionOperFlag &&
                                contractInfo.approvalStatus === APPROVED &&
                                !this.COURSE_TIME_TYPE.includes(contractInfo.packageType)
                            }
                        />
                        <CancelClass
                            contractId={contractInfo.contractId}
                            contractCode={contractInfo.contractCode}
                            aStatus={contractInfo.approvalStatus}
                            pStatus={contractInfo.paymentStatus}
                            list={cancelList}
                            isOpe={
                                isOpe &&
                                isOpe.refundOperFlag &&
                                contractInfo.contractType !== FREE &&
                                !this.COURSE_TIME_TYPE.includes(contractInfo.packageType) &&
                                contractInfo.approvalStatus === APPROVED
                            }
                        />
                        {
                            (isPartReturnCenter || partRefundList.length > 0) &&
                            <PartRefund
                                contractCode={contractInfo.contractCode}
                                contractId={contractInfo.contractId}
                                isOpe={isOpe && isOpe.contractPartRefundFlag}
                                list={partRefundList}
                            />
                        }
                        {
                            (
                                User.permissionList.includes(FUNC['申请合同调整']) &&
                                !this.COURSE_TIME_TYPE.includes(contractInfo.packageType)
                            ) &&
                            <ReviseContract
                                list={reviseList}
                                contractId={contractInfo.contractId}
                                contractCode={contractInfo.contractCode}
                                reviseStatus={reviseStatus}
                                reviseTypes={reviseTypes}
                                isOpe={isOpe && isOpe.contractAdjustFlag}
                            />
                        }
                        <br/><br/>
                    </Scrollbars>
                </div>
                <Modal
                    visible={firstDeductionModal}
                    title={<PageTitle  title={'提示'} className='plr5'/>}
                    onCancel={()=>{
                        this.setState({firstDeductionModal:false})
                    }}
                    onOk={()=>{
                        settingPriority({
                            contractId:contractInfo.contractId,
                            businessSource:contractInfo.businessSource,
                            leadsId:contractInfo.leadsId,
                            currentCenterId:User.currentCenterId,
                            isSetting:1
                        }).then(() => {
                            message.success('设置成功')
                            this.setState({firstDeductionModal:false},this.getContractInfo)
                        })
                    }}
                >
                    已有优先扣课合同，是否需要替换？
                </Modal>
            </div>
        )
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.onResize);
    }
}

export {ContractInfo}
