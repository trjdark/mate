/**
 * desc: 中心业绩报表查询表单
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/1/10
 * Time: 上午10:38
 */
import React, {Component} from 'react';
import {Checkbox} from 'antd';
import {MonthInput} from "@/ui/component/datePicker";
import {selectType} from "../../enum";
import {Select, Option} from "@/ui/component/select";

// 解构出二级组件，方便调用
const {Group} = Checkbox;

class SearchTable extends Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            centerOptions, dataOptions, selectItem, selectedCity, selectedCenter,
            selectedData, startTime, endTime, selectAll, handleSelectStartTime,
            selectedCityAll, selectedCenterAll, selectedDataAll, handleSelectEndTime, selectCities,
            filterCityList, filterCenterList
        } = this.props;
        return (
            <table className="gym-report-form">
                <colgroup>
                    <col width="150"/>
                </colgroup>
                <tbody>
                <tr>
                    <td>查询年月：</td>
                    <td>
                        <div className="gym-report-content-wrap">
                            <MonthInput value={startTime} allowClear={false} onChange={handleSelectStartTime}/>
                            <span className="gym-report-space-mark">~</span>
                            <MonthInput value={endTime} allowClear={false} onChange={handleSelectEndTime}/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>查询中心：</td>
                    <td>
                        <div className="gym-report-content-wrap">
                            <Select
                                className="gym-report-content-wrap-select"
                                mode="multiple"
                                onChange={selectCities}
                                filterOption={
                                    (input:any, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    centerOptions.map((item:any, index:number) =>
                                        <Option
                                            key={`center_${index}`}
                                            value={item.value}>
                                            {item.label}
                                        </Option>
                                    )
                                }
                            </Select>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>城市：</td>
                    <td>
                        <div className="gym-report-content-wrap gym-report-content-citys">
                            <Checkbox
                                name={selectType.选取城市}
                                indeterminate={!!selectedCity.length && (selectedCity.length < filterCityList.length)}
                                onChange={selectAll}
                                checked={selectedCityAll}
                            >
                                全选
                            </Checkbox>
                            <Group
                                options={filterCityList}
                                value={selectedCity}
                                onChange={value => selectItem(value, selectType.选取城市)}
                            />
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>中心：</td>
                    <td>
                        <div className="gym-report-content-wrap gym-report-content-centers">
                            <Checkbox
                                name={selectType.选取中心}
                                indeterminate={!!selectedCenter.length && (selectedCenter.length < filterCenterList.length)}
                                onChange={selectAll}
                                checked={selectedCenterAll}
                            >
                                全选
                            </Checkbox>
                            <Group
                                options={filterCenterList}
                                value={selectedCenter}
                                onChange={value => selectItem(value, selectType.选取中心)}
                            />
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
                </tbody>
            </table>
        )
    }

}

export default SearchTable;
