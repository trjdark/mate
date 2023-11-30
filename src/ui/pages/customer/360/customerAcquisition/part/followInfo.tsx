/**
*Desc: 跟进信息
*User: Debby.Deng
*Date: 2018/11/5,
*Time: 上午10:03
*/
import * as React from "react";
import {DynamicField} from "../common/dynamicField";
import {charLevel} from "../../../enum/assign";
import moment from 'moment';

class FollowInfo extends React.Component<any>{

    render(){
        const {form,isEditable,followInfo}=this.props;//form，isEditable从CommonPart传入，其余从index传入
        return(
            <div className='gym-customer-acquire-table-view'>
            <table>
                <tbody>
                <tr>
                    <td style={{width:'150px'}}>
                        试听：
                    </td>
                    <td>
                        <span>{followInfo.previewTime && moment(followInfo.previewTime).format('YYYY-MM-DD')}</span>
                    </td>

                </tr>
                <tr>
                    <td>
                        到访次数：
                    </td>
                    <td>
                        <span>{followInfo.visitedNum}</span>
                    </td>

                </tr>
                <tr>
                    <td>
                        跟进次数：
                    </td>
                    <td>
                        <span>{followInfo.followedNum}</span>
                    </td>

                </tr>
                <tr>
                    <td>
                        定金：
                    </td>
                    <td>
                        <span>{followInfo.depositTime && moment(followInfo.depositTime).format('YYYY-MM-DD')}</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        意向度：
                    </td>
                    <td>
                        <DynamicField fieldName={`intentionLevelCode`}
                                      type={`select`}
                                      options={charLevel}
                                      optionName={'name'}
                                      optionValue={'value'}
                                      required={true}
                                      validMsg={`请填写意向度`}
                                      initialValue={[followInfo.intentionLevelValue,followInfo.intentionLevelCode]}
                                      isEditable={isEditable}
                                      form={form}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        意向度备注：
                    </td>
                    <td>
                        <DynamicField fieldName={`intentionComment`}
                                      type={`textArea`}
                                      initialValue={followInfo.intentionComment}
                                      isEditable={isEditable}
                                      form={form}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        最后修改时间：
                    </td>
                    <td>
                        <span>{followInfo.intentionLastestDate && moment(followInfo.intentionLastestDate).format(`YYYY-MM-DD HH:mm:ss`)}</span>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        )
    }
}

export {FollowInfo}
