/**
*Desc: leads信息不可编辑
*User: Debby.Deng
*Date: 2018/11/16,
*Time: 上午10:27
*/
import * as React from "react";
import moment from 'moment';
import {Checkbox} from "antd";


class LeadsInfo_noEdit extends React.Component<any>{
    render(){
        const {leadsInfo,isEditable}=this.props;//form，isEditable从CommonPart传入，其余从index传入
        const isRecommend=(leadsInfo.channelType==='72006' || leadsInfo.channelType==='72010');
        const isFromMarket=!!leadsInfo.marketingActivityId;
        return(
            <div className={`${isEditable? 'hide' : 'show'} gym-customer-acquire-leads-info` }>
                <table className='gym-customer-acquire-table-view'>
                    <tbody>
                    <tr>
                        <td style={{width:'150px'}}>
                            获取日期：
                        </td>
                        <td>

                            <span>{moment(leadsInfo.inquireDate).format('YYYY-MM-DD')}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            创建日期：
                        </td>
                        <td>
                            <span>{moment(leadsInfo.createDate).format('YYYY-MM-DD')}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            出现方式：
                        </td>
                        <td>
                            {leadsInfo.appearanceTypeValue}

                        </td>

                    </tr>
                    <tr>
                        <td>
                            渠道来源：
                        </td>
                        <td>
                            {leadsInfo.channelTypeValue}
                        </td>

                    </tr>
                    <tr>
                        <td>
                            渠道备注：
                        </td>
                        <td>
                            {leadsInfo.channelComment}
                        </td>

                    </tr>
                    <tr>
                        <td>
                            是否来源于市场：
                        </td>
                        <td>
                            <Checkbox disabled={true} checked={isFromMarket}/>
                        </td>

                    </tr>
                    <tr>
                        <td>
                            市场渠道名称：
                        </td>
                        <td>
                            {leadsInfo.marketingActivityName}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Promotor：
                        </td>
                        <td>
                            {leadsInfo.promotorName}

                        </td>
                    </tr>
                    <tr>
                        <td>
                            是否推荐：
                        </td>
                        <td>
                            <Checkbox disabled={true} checked={isRecommend}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            推荐人：
                        </td>
                        <td>
                            {leadsInfo.referalName}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            推荐人手机号码：
                        </td>
                        <td>
                            {leadsInfo.referalPhoneNum}
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
        )
    }
}

export {LeadsInfo_noEdit}
