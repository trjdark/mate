/**
 * desc: 市场渠道业绩报表查询表单
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/21
 * Time: 上午10:38
 */
import React, {Component} from 'react';
import {Checkbox} from 'antd';
import {selectType} from "../enum";
import {MonthInput} from "@/ui/component/datePicker";

// 解构出二级组件，方便调用
const {Group} = Checkbox;

class MarketAchieveSearchTable extends Component<any, any> {
    constructor(props) {
        super(props);
    }
    disabledStartDate = (beginDate) => {
        const { endDate } = this.props;
        if (!beginDate || !endDate) {
            return false;
        }
        return beginDate.valueOf() > endDate.valueOf();
    };
    disabledEndDate = (endDate) => {
        const { beginDate } = this.props;
        if (!endDate || !beginDate) {
            return false;
        }
        return endDate.valueOf() < beginDate.valueOf();
    };
    render() {
        const {
            channelTypeOptions, dataOptions, selectedChannelType, selectItem, selectedData, endDate,
            selectAll, selectedDataAll, selectedChannelTypeAll, handleSelectEndTime, beginDate,
            handleSelectStartTime
        } = this.props;
        return (
            <table className="gym-report-form">
                <colgroup>
                    <col width="150px"/>
                    <col width="auto"/>
                </colgroup>
                <tbody>
                <tr>
                    <td>查询年月：</td>
                    <td>
                        <div className="gym-report-content-wrap">
                            <MonthInput value={beginDate} allowClear={false} onChange={handleSelectStartTime} disabledDate={this.disabledStartDate}/>
                            <span>-</span>
                            <MonthInput value={endDate} allowClear={false} onChange={handleSelectEndTime} disabledDate={this.disabledEndDate}/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>数据项：</td>
                    <td>
                        <div className="gym-report-content-wrap gym-report-content-datas">
                            <Checkbox
                                name={selectType.选取数据项}
                                indeterminate={!!selectedData.length && (selectedData.length < dataOptions.length)}
                                onChange={selectAll}
                                checked={selectedDataAll}
                            >
                                全选
                            </Checkbox>
                            <Group
                                options={dataOptions}
                                value={selectedData}
                                onChange={value => selectItem(value, selectType.选取数据项)}
                            />
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>渠道来源：</td>
                    <td>
                        <div className="gym-report-content-wrap gym-report-content-datas">
                            <Checkbox
                                name={selectType.选取渠道来源}
                                indeterminate={!!selectedChannelType.length && (selectedChannelType.length < channelTypeOptions.length)}
                                onChange={selectAll}
                                checked={selectedChannelTypeAll}
                            >
                                全选
                            </Checkbox>
                            <Group
                                options={channelTypeOptions}
                                value={selectedChannelType}
                                onChange={value => selectItem(value, selectType.选取渠道来源)}
                            />
                        </div>
                    </td>
                </tr>
                {
                    // todo 隐藏渠道备注，下期迭代处理
                    /*<tr>
                    <td>渠道备注：</td>
                    <td>
                        <div className="gym-report-content-wrap gym-report-content-datas">
                            <TextArea
                                className="gym-report-content-remark"
                                value={channelComment}
                                onChange={handleTextChange}
                            />
                        </div>
                    </td>
                </tr>*/}
                </tbody>
            </table>
        )
    }
}

export default MarketAchieveSearchTable;
