/**
 * desc: 审批管理单详情
 * User: Vicky.yu
 * Date: 2020/12/7
 * Time: 17：00
 */

import React, { Fragment } from 'react';
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { PageTitle } from "@/ui/component/pageTitle";
import { Button } from "antd";
import { CommonUtils } from "@/common/utils/commonUtils";
import { accountChangeDetail } from "@redux-actions/report/approve";
import { form } from "@/common/decorator/form";
import history from "@/router/history";
import '../style/index.scss';
import { User } from '@/common/beans/user';
import moment from 'moment';


const workingStatus = {
    0: '停用',
    1: '正常',
    2: '锁定'
}
const gender = {
    0: '女',
    1: '男',
}
const cardType = {
    1: '身份证',
    2: '护照'
}
@form()
class ApproveDetail extends React.Component<any, any> {
    id: string;
    applyType: string;
    private routes: Array<any> = [
        {
            name: '设置',
            path: '',
            link: '#',
            id: 'setting'
        }, {
            name: '用户管理',
            path: '',
            link: '#',
            id: 'user'
        },
        {
            name: '账号变更审批',
            path: '',
            link: '#',
            id: 'approveManage'
        },
    ];
    constructor(props: any) {
        super(props);
        this.state = {
            detail: {}, // 详细信息
        }
    }
    componentDidMount() {
        this.id = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).id : '';
        this.applyType = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).applyType : '';
        const params = {
            currentCenterId: User.currentCenterId,
            id: this.id,
            applyType: this.applyType,
        }
        accountChangeDetail(params).then((res: any) => {
            this.setState({ detail: res })
        })
    }
    goBackList = () => {
        history.goBack();
    }
    dealData = (arr) => {
        return arr.map((item: any, index: number) => {
            const { fieldChineseName, fieldsName, beforeValue, afterValue } = item;
            switch (fieldsName) {
                case 'gender':
                    return {
                        beforeValue: gender[beforeValue],
                        afterValue: gender[afterValue],
                        fieldChineseName,
                    }
                case 'entryDate':
                case 'leaveDate':
                    return {
                        beforeValue: beforeValue&&moment(Number(beforeValue)).format("YYYY-MM-DD"),
                        afterValue: afterValue&&moment(Number(afterValue)).format("YYYY-MM-DD"),
                        fieldChineseName,
                    }
                case 'idcardType':
                    return {
                        beforeValue: cardType[beforeValue],
                        afterValue: cardType[afterValue],
                        fieldChineseName,
                    }
                case 'workingStatus':
                    return {
                        beforeValue: workingStatus[beforeValue],
                        afterValue: workingStatus[afterValue],
                        fieldChineseName,
                    }
                default:
                    return item
            }
        });
    }
    render() {
        const { detail } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id="gym-evaluation-detail" className="gym-approve-detail page-wrap">
                    <div className='gym-approve-detail-head'>
                        <div className='gym-approve-detail-head-title'>
                            <span className='corange'>账号信息变更明细</span>
                        </div>
                    </div>
                    <PageTitle title='员工信息' />
                    {
                        detail.applyStaffInfoResponses ? this.dealData(detail.applyStaffInfoResponses).map((item: any, index: number) => (
                            (
                                <div className='gym-approve-detail-info' key={index} >
                                    <div className='gym-approve-detail-info-item'>
                                        <span className='gym-approve-detail-info-item-label'>{item.fieldChineseName}</span>
                                    </div>
                                    <div className='gym-approve-detail-info-item'>
                                        <span className='gym-approve-detail-info-item-label'>变更前：</span>
                                        <span className='gym-approve-detail-info-item-content'>
                                            {item.beforeValue}
                                        </span>
                                    </div>
                                    <div className='gym-approve-detail-info-item change'>
                                        <span className='gym-approve-detail-info-item-label'>变更后：</span>
                                        <span className='gym-approve-detail-info-item-content'>
                                            {item.afterValue}
                                        </span>
                                    </div>
                                </div>
                            )
                        )) : null
                    }
                    <PageTitle title='岗位分配' />
                    {
                        (detail && detail.applyStaffPostResponses || []).map((item: any, index: number) => (
                            <div className='gym-approve-detail-info'>
                                <div className='gym-approve-detail-info-item'>
                                    <span className='gym-approve-detail-info-item-label'>岗位：</span>
                                </div>
                                <div className='gym-approve-detail-info-item'>
                                    <span className='gym-approve-detail-info-item-label'>变更前：</span>
                                    <span className='gym-approve-detail-info-item-content'>{item.beforePostName}</span>
                                </div>
                                <div className='gym-approve-detail-info-item change'>
                                    <span className='gym-approve-detail-info-item-label'>变更后：</span>
                                    <span className='gym-approve-detail-info-item-content'>{item.afterPostName}</span>
                                </div>
                            </div>
                        ))
                    }
                    <PageTitle title='角色分配' />
                    <div className='gym-approve-detail-info'>
                        <div className='gym-approve-detail-info-item'>
                           {
                            detail.beforeRoleNames &&
                            <span className='gym-approve-detail-info-item-label'>角色：</span>
                            }
                        </div>
                        <div className='gym-approve-detail-info-item'>
                            {
                                detail.beforeRoleNames &&
                                <span className='gym-approve-detail-info-item-label'>变更前：</span>
                            }
                            <span className='gym-approve-detail-info-item-content'>{detail.beforeRoleNames}</span>
                        </div>
                        <div className='gym-approve-detail-info-item change'>
                            {
                                detail.beforeRoleNames &&
                                <span className='gym-approve-detail-info-item-label'>变更后：</span>
                            }
                            <span className='gym-approve-detail-info-item-content'>{detail.afterRoleNames}</span>
                        </div>
                    </div>
                    <div className="btn">
                        <Button className="gym-button-default gym-button-xs gobackBtn" onClick={this.goBackList}>关闭</Button>
                    </div>

                </div>
            </Fragment>
        )
    }
}

export { ApproveDetail }
