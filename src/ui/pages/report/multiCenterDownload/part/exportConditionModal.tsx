/*
 * @desc: 导出条件弹窗组件
 * @Author: luck.yuan@gymboglobal.com
 * @Date: 2021-12-15 16:18:22
 */
import { ListModal } from '@/ui/component/listModal';

import moment from 'antd/node_modules/moment';
import React from 'react';
import { appearanceTypeList, reacquireTypeList } from "../../enum/index";
import { finishStatusList, countScopeList, columns, visitCountList } from "../../visitForm/enum/index"
import '../style/index.scss'
import {dateFields} from "@/ui/pages/customer/clientCenter/enum";
class ExportConditionModal extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
        }
    }
    /**
     * 字段转换位
     * @param {Array<any>} arr
     */
    selectDateFieldName = (arr:Array<any>) => {
        let result = [];
        result = [
            {label: '宝宝名', dataIndex: 'babyName'},
            {label: '昵称', dataIndex: 'nickname'},
            ...dateFields()
        ].filter((item) => arr.includes(item.dataIndex)).map(item => item.label);
        return result;
    };

    render() {
        const { reportName, dataSource, enumList, query } = this.props;
        const { visible } = this.state;
        const { channelTypeList } = enumList;
        return (
            <div>
                <span
                    className="gym-report-multicenterexport-table-exportCondition-text"
                    onClick={this.showModal}>
                    查看详情
                </span>
                <ListModal
                    className="gym-report-multicenterexport-table-exportCondition-listModal"
                    visible={visible}
                    onCancel={this.closeModal}
                    maskClosable={true}
                    closable={true}
                    footer={null}
                    width={506}
                >
                    {(reportName === '市场名单明细' || reportName === '市场名单明细(销售向)') &&
                        <div className="gym-report-multicenterexport-table-exportCondition-listModal-container">
                            {dataSource.inquireDateBeg &&
                                <p>获取时间：{moment(dataSource.inquireDateBeg).format('YYYY-MM-DD')}至{moment(dataSource.inquireDateEnd).format('YYYY-MM-DD')}</p>
                            }
                            {dataSource.createDateBeg &&
                                <p>导入时间：{moment(dataSource.createDateBeg).format('YYYY-MM-DD')}至{moment(dataSource.createDateEnd).format('YYYY-MM-DD')}</p>
                            }
                            {dataSource.oppTimeBeg &&
                                <p>首次到访日期：{moment(dataSource.oppTimeBeg).format('YYYY-MM-DD')}至{moment(dataSource.oppTimeEnd).format('YYYY-MM-DD')}</p>
                            }
                            {dataSource.signDateBeg &&
                                <p>签约日期：{moment(dataSource.signDateBeg).format('YYYY-MM-DD')}至{moment(dataSource.signDateEnd).format('YYYY-MM-DD')}</p>
                            }
                            {dataSource.previewDateBeg &&
                                <p>试听日期：{moment(dataSource.previewDateBeg).format('YYYY-MM-DD')}至{moment(dataSource.previewDateEnd).format('YYYY-MM-DD')}</p>
                            }
                            {dataSource.channelComment &&
                                <p>渠道备注：{dataSource.channelComment}</p>
                            }
                            {dataSource.theme &&
                                <p>渠道名称：{dataSource.theme}</p>
                            }
                            {
                                <p>成长伙伴：多中心导出时，涉及员工选项无效</p>
                            }
                            {dataSource.appearanceType &&
                                <p>出现方式：{appearanceTypeList.find(item => item.postCode === dataSource.appearanceType).postName}</p>
                            }
                            {dataSource.channelType &&
                                <p>渠道来源：{channelTypeList.find(item => item.value === dataSource.channelType).label}</p>
                            }
                            {dataSource.reacquire
                                ? <p>是否再次获取：{reacquireTypeList.find(item => item.postCode === dataSource.reacquire).postName}</p>
                                : <p>是否再次获取：{reacquireTypeList.find(item => item.postCode === null).postName}</p>
                            }
                            {dataSource.centerCodeList &&
                                <p>选择中心：{dataSource.centerCodeList}</p>
                            }
                        </div>
                    }
                    {reportName === '到访表' &&
                        <div className="gym-report-multicenterexport-table-exportCondition-listModal-container">
                            {dataSource.createDateBegin &&
                                <p>诺访时间：{moment(dataSource.createDateBegin).format('YYYY-MM-DD')}至{moment(dataSource.createDateEnd).format('YYYY-MM-DD')}</p>
                            }
                            {dataSource.taskTimeBegin &&
                                <p>计划到访时间：{moment(dataSource.taskTimeBegin).format('YYYY-MM-DD')}至{moment(dataSource.taskTimeEnd).format('YYYY-MM-DD')}</p>
                            }
                            {dataSource.taskFinishTimeBegin &&
                                <p>任务完成时间：{moment(dataSource.taskFinishTimeBegin).format('YYYY-MM-DD')}至{moment(dataSource.taskFinishTimeEnd).format('YYYY-MM-DD')}</p>
                            }
                            {dataSource.visitCount &&
                                <p>首/多访：{this.attrTranslate(visitCountList, dataSource.visitCount, 'postCode', 'postName')}</p>
                            }
                            {dataSource.finishStatus &&
                                <p>完成状态：{finishStatusList.find(item => item.postCode === dataSource.finishStatus).postName}</p>
                            }
                            {dataSource.countScope
                                ? <p>统计范围：{countScopeList.find(item => item.postCode === dataSource.countScope).postName}</p>
                                : <p>统计范围：{countScopeList.find(item => item.postCode === null).postName}</p>
                            }
                            {dataSource.inquireDateBegin &&
                                <p>获取时间：{moment(dataSource.inquireDateBegin).format('YYYY-MM-DD')}至{moment(dataSource.inquireDateEnd).format('YYYY-MM-DD')}</p>
                            }
                            {dataSource.columns &&
                                <p>数据项：{this.attrTranslate(columns, dataSource.columns, 'postCode', 'postName')}</p>
                            }
                            {dataSource.centerCodeList &&
                                <p>选择中心：{dataSource.centerCodeList}</p>
                            }
                        </div>
                    }
                    {
                        reportName === '客户中心' &&
                            <div className="gym-report-multicenterexport-table-exportCondition-listModal-container">
                                {dataSource.centerCodeList &&
                                    <p>选择中心：{dataSource.centerCodeList}</p>
                                }
                                <p>查询条件：<span>{query}</span> </p>
                                {dataSource.columns &&
                                    <p>下载字段：{this.selectDateFieldName(dataSource.columns).join('，')}</p>
                                }

                            </div>
                    }
                </ListModal>
            </div>
        );
    }

    /**
     * 显示弹层
     */
    showModal = () => {
        this.setState({ visible: true })
    };

    /**
     * 关闭弹层
     */
    closeModal = () => {
        this.setState({ visible: false })
    };

    /**
     * @desc:根据数据、数据某一属性部分值的集合，得到另外一个属性相应的集合
     * @param {data:[] 数据源, attrAList:string[] 属性A的数组集合, attrA:string 属性A, attrB:string 属性B}
     * @返回值 {str:属性B集合 字符串}
     */
    attrTranslate(data, attrAEnum, attrA, attrB) {

        if (!Array.isArray(attrAEnum)) {                                    // 单属性转译
            if (data.some(item => item[attrA] === attrAEnum)) {
                return data.find(item => item[attrA] === attrAEnum)[attrB]  // 对数据进行转译
            } else {
                return attrAEnum                                            // 历史数据展示枚举值
            }
        } else {                                                            // 属性集合转译
            let newArr = []
            attrAEnum.map((item) => {
                newArr.push(data.filter(obj => obj[attrA] === item)[0][attrB])
            })
            return newArr.join('、 ')
        }

    }

}

export default ExportConditionModal;
