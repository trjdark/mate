/**
 * desc: 宝宝信息卡片
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/2/10
 * Time: 下午2:20
 */
import React, { Component} from "react";
import moment from 'moment';
import {Tabs, Icon} from 'antd';
import {CommonUtils} from "@/common/utils/commonUtils";

const {TabPane} = Tabs;


declare interface BabyInfoCardProps {
    babyInfoList:Array<any>,
    leadsInfo:any,
    emitChangeBaby:(babyId:string) => void
    phaseValue: string
}

class BabyInfoCard extends Component<BabyInfoCardProps, any>{
    changeTab = (value:string) => {
        this.props.emitChangeBaby(value)
    }
    render(){
        const {babyInfoList, leadsInfo, phaseValue} = this.props;
        return(
            <div id="gym-call-baby-info-card" className="gym-call-baby-info-card">
                {
                    babyInfoList.length > 0
                    ?
                    <Tabs type="card" className="gym-call-baby-info-card-tabs" onChange={this.changeTab}>
                        {
                            (babyInfoList || []).map((baby:any) => (
                                <TabPane tab={baby.babyName} key={baby.id} >
                                    <div className='gym-call-baby-info-card-main'>
                                        <div className="avatar">
                                            <img src={require('../../../../../images/defaultAvator.png')} alt=""/>
                                            {
                                                baby.gender === 1 ?
                                                    <span className="avatar-gender"><Icon type="man" /></span>
                                                    :
                                                    <span className="avatar-gender"><Icon type="woman"/></span>
                                            }
                                        </div>
                                        <div className="content">
                                            <p className="bbname">{baby.babyName}{baby.nickname && <span>（{baby.nickname}）</span>}</p>
                                            <p>
                                                <span className='mr25'>月龄：{( baby.monthValue && baby.monthValue >= 0) ? baby.monthValue + '个月' : '-'}</span>
                                                <span>阶段：<span className="cDefault">{phaseValue}</span></span>
                                            </p>
                                            <p>获取日期：{leadsInfo.inquireDate ? moment(leadsInfo.inquireDate).format("YYYY-MM-DD") : "-"}</p>
                                            <p>出现方式：{leadsInfo.appearanceTypeValue ||  "-"}</p>
                                            <p>渠道来源：{leadsInfo.channelTypeValue ||  "-"}</p>
                                            <p>意向度:<span>{leadsInfo.intentionLevel|| "-"}</span></p>
                                            <p>渠道备注：{leadsInfo.channelComment ? CommonUtils.cutstr(leadsInfo.channelComment, 10) : "-"}</p>
                                        </div>
                                    </div>
                                </TabPane>
                            ))
                        }
                    </Tabs>
                    : null
                }

            </div>
        )
    }
}

export {BabyInfoCard}
