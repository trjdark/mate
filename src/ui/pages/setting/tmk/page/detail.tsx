/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/2/28
 * Time: 上午9:14
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {User} from "@/common/beans/user";
import {getTmkCenterInfo} from "../../../../../redux-actions/setting/tmk";
import {CommonUtils} from "@/common/utils/commonUtils";
import {PageTitle} from "@/ui/component/pageTitle";

class TmkTelephoneCenterDetail extends React.Component<any, any>{
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
        Promise.all([
            getTmkCenterInfo({
                currentCenterId:User.currentCenterId,
                tmkCenterId: this.tmkCenterId
            }),
        ]).then((res) => {
            this.setState({

                tmkCenterInfo: res[0]
            })
        });
    }
    render(){
        const {tmkCenterInfo} = this.state;
        return(
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id={`gym-tmk-detail`} className="gym-tmk-detail page-wrap">
                    <PageTitle title="TMK中心信息"/>
                    <div className="gym-tmk-detail-item">
                        <div className="gym-tmk-detail-item-label">
                            <span>TMK中心名称：</span>
                        </div>
                        <div className="gym-tmk-detail-item-content">
                            <span>{tmkCenterInfo.tmkCenterName}</span>
                        </div>
                    </div>
                    <div className="gym-tmk-detail-item">
                        <div className="gym-tmk-detail-item-label">
                            <span>所属GI：</span>
                        </div>
                        <div className="gym-tmk-detail-item-content">
                            <span>{tmkCenterInfo.associatedGiName}</span>
                        </div>
                    </div>
                    <div className="gym-tmk-detail-item">
                        <div className="gym-tmk-detail-item-label">
                            <span>中心：</span>
                        </div>
                        <div className="gym-tmk-detail-item-content">
                            {
                                (tmkCenterInfo.associatedCenter || []).map((item:any) => (
                                    <span key={item.id}>{item.centerCode}-{item.centerName}，</span>
                                ))
                            }
                        </div>
                    </div>
                    <div className="gym-tmk-detail-item">
                        <div className="gym-tmk-detail-item-label">
                            <span>HTMK用户名：</span>
                        </div>
                        <div className="gym-tmk-detail-item-content">
                            {
                                (tmkCenterInfo.associatedHtmk || []).map((item:any) => (
                                    <span key={item.id}>{item.username}，</span>
                                ))
                            }
                        </div>
                    </div>
                    <div className="gym-tmk-detail-item">
                        <div className="gym-tmk-detail-item-label">
                            <span>TMK用户名：</span>
                        </div>
                        <div className="gym-tmk-detail-item-content">
                            {
                                (tmkCenterInfo.associatedTmk || []).map((item:any) => (
                                    <span key={item.id}>{item.username}，</span>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export {TmkTelephoneCenterDetail}
