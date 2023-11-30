/**
 * desc: 中心业绩报表
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/10
 * Time: 上午10:38
 */
import React, {Component, Fragment} from 'react';
import moment from "moment";
import {message} from "antd";
import {chunk} from 'lodash';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import SearchTable from './part/searchTable';
import SearchResult from './part/searchResult';
import {PageTitle} from "@/ui/component/pageTitle";
import FullScreen from '../components/fullScreen';
import SearchCollapse from '../components/seachCollapse';
import {
    getCitiesList,
    getCentersList,
    getCenterAchievementData,
    downloadAchieveCenterExcel
} from "@redux-actions/report/achievement";
import {selectType, dataOptionList} from "../enum";
import {User} from "@/common/beans/user";
import {couldDownLoad, watchTableScroll} from "../common";

const dataOptionValueList = dataOptionList.map(item => item.value);

class AchievementCenter extends Component<any, any> {
    private loadNum = 20;   // 每次滚动加载的表格数据
    private page = 0;       // 滚动加载表格数据的下标
    private currentCenterId = User.currentCenterId;
    private userId = User.userId;
    private watchTableScroll: any;

    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {
                    name: '报表'
                },
                {
                    name: '业绩类报表'
                },
                {
                    name: '中心业绩'
                }
            ],
            cityOptions: [],                     // 城市列表数据
            centerOptions: [],                   // 中心列表数据
            dataOptions: dataOptionList,            // 数据项列表
            dataSource: [],                         // 需要展示到表格中的中心业绩报表数据
            allDataSource: [],                      // 中心业绩表报数据
            selectedCity: [],                       // 选中的城市
            selectedCenter: [],                     // 选中的中心
            selectedData: dataOptionValueList,      // 选中的数据项, 默认全选
            selectedCityAll: false,                 // 全选城市，默认不全选
            selectedCenterAll: false,               // 全选中心，默认不全选
            selectedDataAll: true,                  // 全选数据想，默认全选
            startTime: moment(),                    // 开始时间
            endTime: moment(),                      // 结束时间
            lastSyncDatetime: null,                 // 数据最后同步时间
            filterCity: [],                         // 过滤城市列表
            filterCenter: [],                       // 过滤中心列表
        };

        this.watchTableScroll = watchTableScroll.bind(this);    // 监视表格滚动的方法，需要绑定当前组件的this
    }

    render() {
        const {
            breadCrumbRoutes, cityOptions, centerOptions, dataOptions, dataSource,
            selectedCity, selectedCenter, selectedData, startTime, endTime,
            selectedCityAll, selectedCenterAll, selectedDataAll, primaryCity,
            lastSyncDatetime, filterCity, filterCenter
        } = this.state;

        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes}/>
                <SearchCollapse handleSearch={this.getCenterAchievementData} handleReset={this.handleReset}>
                    <SearchTable
                        cityOptions={cityOptions}
                        primaryCity={primaryCity}
                        centerOptions={centerOptions}
                        dataOptions={dataOptions}
                        selectedCity={selectedCity}
                        selectedCenter={selectedCenter}
                        selectedData={selectedData}
                        selectedCityAll={selectedCityAll}
                        selectedCenterAll={selectedCenterAll}
                        selectedDataAll={selectedDataAll}
                        startTime={startTime}
                        endTime={endTime}
                        selectItem={this.handleSelectItem}
                        handleSelectStartTime={this.handleSelectStartTime}
                        handleSelectEndTime={this.handleSelectEndTime}
                        selectAll={this.handleSelectAll}
                        selectCities={this.handleSelectCities}
                        filterCityList={filterCity}
                        filterCenterList={filterCenter}
                    />
                </SearchCollapse>
                <div className="page-wrap gym-report-wrap">
                    <PageTitle title="查询结果" className="gym-report-result-title"/>
                    <FullScreen
                        lastSyncDatetime={lastSyncDatetime}
                        handleDownLoadExcel={this.handleDownLoadExcel}
                        canDownload={dataSource.length > 0}
                    >
                        <SearchResult
                            dataSource={dataSource}
                            selectedData={selectedData}
                            dataOptionList={dataOptionList}
                        />
                    </FullScreen>
                </div>
            </Fragment>
        );
    }

    componentDidMount() {
        this.getInitialData();
    }

    /*获取初始化数据，包括城市列表，中心列表，数据项*/
    getInitialData = () => {
        // 城市和中心数据参数
        const params = {
            currentCenterId: this.currentCenterId,
            staffId: this.userId,
        };

        // 先获取城市列表，中心列表
        return Promise.all([getCitiesList(params), getCentersList(params)]).then(res => {
            let [{cityOptions, selectedCity}, centerOptions] = res;
            const selectedCenter = this.selectedCenterByCity(selectedCity, centerOptions);
            // 中心名称显示为  中心code + 中心名称
            this.setState({
                cityOptions,
                centerOptions,
                selectedCity,
                selectedCenter,
                selectedCityAll: selectedCity.length === cityOptions.length,    // 设置城市的全选标志
                selectedCenterAll: selectedCenter.length === centerOptions.length,  // 设置中心的全选标志
                filterCity: cityOptions,
                filterCenter: centerOptions
            });
        }).catch(err => {
            message.error(err);
        });
    };

    /**
     * 选择开始月份
     * @param value 选择的月份
     */
    handleSelectStartTime = (value: moment.Moment) => {
        if (value.valueOf() > this.state.endTime.valueOf()) {
            // 如果选择的开始时间大于结束时间，提示错误
            message.error('开始时间必须小于结束时间');
            return;
        }
        this.setState({
            startTime: value
        })
    };

    /**
     * 选择结束月份
     * @param value 选择的结束月份
     */
    handleSelectEndTime = (value: moment.Moment) => {
        if (value.valueOf() < this.state.startTime.valueOf()) {
            // 如果选择的结束时间小于开始时间，提示错误
            message.error('结束时间必须大于开始时间');
            return;
        }
        this.setState({
            endTime: value
        })
    };

    /**
     * 选择多选框条目
     * @param value Array<string> 选中的多选框列表
     * @param type string 多选框类型
     */
    handleSelectItem = (value: Array<string>, type) => {
        // 设置选中的条目
        this.setState({
            [type]: value,
            [`${type}All`]: value.length === this.state[type].length
        });

        // 根据选中条目的数量，标记全选按钮
        this.setSelectedAllStatus(value, type)
    };
    /**
     * 筛选中心
     */
    handleSelectCities = (values:Array<string>) => {
        const {cityOptions, centerOptions} = this.state;
        if(values.length > 0) {
            const newCenterList = centerOptions.filter((item:any) => values.includes(item.value));
            const citySet = new Set();
            newCenterList.forEach((item:any) => citySet.add(item.cityId));
            this.setState({
                filterCity: cityOptions.filter((item:any) => citySet.has(item.value)),
                filterCenter: newCenterList,
                selectedCity: [],
                selectedCenter: [],
                selectedCityAll: false,
                selectedCenterAll: false,
            })
        }else {
            this.setState({
                filterCity: cityOptions,
                filterCenter: centerOptions,
                selectedCity: [],
                selectedCenter: [],
                selectedCityAll: false,
                selectedCenterAll: false,
            })
        }
    };
    /*根据选中条目的数量，与全选按钮，城市选项，中心选项联动*/
    setSelectedAllStatus = (value, type) => {
        const {dataOptions, filterCity, filterCenter} = this.state;
        switch (type) {
            case selectType.选取城市:
                const selectedCenter = this.selectedCenterByCity(value, filterCenter);
                this.setState({
                    selectedCenter: selectedCenter,
                    selectedCityAll: value.length === filterCity.length,
                    selectedCenterAll: selectedCenter.length === filterCenter.length
                });
                break;
            case selectType.选取中心:
                const selectedCity = this.selectedCityByCenter(value);
                this.setState({
                    selectedCenterAll: value.length === filterCenter.length,
                    selectedCityAll: selectedCity.length === filterCity.length,
                    selectedCity,
                });
                break;
            case selectType.选取数据项:
                this.setState({
                    selectedDataAll: value.length === dataOptions.length
                });
                break;
            default:
                break;
        }
    };

    /**
     * 全选
     * @param e 事件对象
     */
    handleSelectAll = (e) => {
        const {name, checked} = e.target;
        const {dataOptions, filterCity, filterCenter} = this.state;
        if (checked) {
            if (name === selectType.选取城市 || name === selectType.选取中心) {
                // 点击全选城市或者全选中心时，要把城市和中心全部选中
                this.countSelectedValue(filterCity, selectType.选取城市);
                this.countSelectedValue(filterCenter, selectType.选取中心);
            } else if (name === selectType.选取数据项) {
                this.countSelectedValue(dataOptions, selectType.选取数据项);
            }
        } else {
            if (name === selectType.选取城市 || name === selectType.选取中心) {
                // 取消全选时，要把城市和中心全部取消全选，同时把全选标记清除
                this.setState({
                    [selectType.选取城市]: [],
                    [selectType.选取中心]: [],
                    [`${selectType.选取城市}All`]: false,
                    [`${selectType.选取中心}All`]: false,
                })
            } else if (name === selectType.选取数据项) {
                this.setState({
                    [name]: [],
                });
            }
        }

        // 设置或取消全选标记
        this.setState({
            [`${name}All`]: checked
        })
    };

    /*全选时计算选中的value数组*/
    countSelectedValue = (list: Array<any>, name: string) => {
        const arr = list.map(item => item.value);
        // 把条目设置为全选，同时把标记也设置为选中状态
        this.setState({
            [name]: arr,
            [`${name}All`]: true,
        })
    };

    /**
     * 根据选中的城市，选择中心
     * @param selectedCity, 已选择的城市
     * @param centerOptions, 中心列表
     * @return selectedCenter, 选中的中心列表
     */
    selectedCenterByCity = (selectedCity, centerOptions) => {
        let selectedCenter = [];
        selectedCity.forEach(item => {
            centerOptions.forEach(val => {
                const {cityId, value} = val;
                if (cityId === item) {
                    selectedCenter.push(value);
                }
            })
        });
        return selectedCenter;
    };

    /**
     * 根据选择的中心，选择城市
     */
    selectedCityByCenter = (selectedCenter) => {
        const {centerOptions} = this.state;
        let selectedCenterItems = [];
        // 根据选中的id删选出选中的中心信息
        selectedCenter.forEach(item => {
            centerOptions.forEach(val => {
                if (item === val.value) {
                    selectedCenterItems.push(val);
                }
            });
        });
        // 取出选中的中心对应的城市id
        let selectedCity = selectedCenterItems.map(item => {
            return item.cityId;
        });
        // 部分中心对应的城市中心为空，去除空字符串
        for (let i = selectedCity.length - 1; i >= 0; i--) {
            if (selectedCity[i] === '') {
                selectedCity.splice(i, 1);
            }
        }
        // 返回出去重后的数组
        return Array.from(new Set(selectedCity));
    };

    /**
     * 生成查询参数
     * @return object 参数对象
     */
    createParams = () => {
        const {startTime, endTime, selectedCity, selectedCenter, selectedData} = this.state;
        return {
            currentCenterId: this.currentCenterId,
            beginDate: startTime.valueOf(),
            endDate: endTime.valueOf(),
            cityIds: selectedCity.join(),
            centerIds: selectedCenter.join(),
            column: selectedData.join() || undefined,
        }
    };

    /**
     * 验证查询参数
     * @param params 查询参数
     * @return boolean true为通过校验 false为未通过校验
     */
    validParams = (params) => {
        if (!params.cityIds || !params.centerIds) {
            message.error('请至少选择一个城市和中心！');
            return false;
        }
        if (!params.column) {
            message.error('请至少选择一个数据项！');
            return false;
        }
        return true;
    };

    /*查询中心业绩数据*/
    getCenterAchievementData = () => {
        // 报表参数
        const reportParams = this.createParams();

        if (this.validParams(reportParams)) {
            // 请求报表数据
            getCenterAchievementData(reportParams).then(res => {
                const {list, lastSyncDatetime} = res;
                if (list || lastSyncDatetime) {
                    // 数据量过大时，分段展示表格，把数据按照设定的每页条数分组
                    const allDataSource = chunk((list || []), this.loadNum);
                    this.page = 0;  // 重置下标
                    this.setState(
                        {
                            dataSource: allDataSource[this.page] || [],   // 先加载第一段数据
                            lastSyncDatetime: lastSyncDatetime || Date.now(),
                            allDataSource
                        },
                        () => {
                            // 首次获取数据后，监视表格滚动;
                            this.watchTableScroll(this.page);
                        }
                    )
                }
            });
        }
    };

    /*重置*/
    handleReset = () => {
        this.setState(
            {
                selectedCity: [],                       // 选中的城市
                selectedCenter: [],                     // 选中的中心
                selectedData: dataOptionValueList,      // 选中的数据项, 默认全选
                selectedCityAll: false,                 // 全选城市，默认不全选
                selectedCenterAll: false,               // 全选中心，默认不全选
                selectedDataAll: true,                  // 全选数据想，默认全选
                startTime: moment(),                    // 开始时间
                endTime: moment(),                      // 结束时间
                lastSyncDatetime: null,                 // 数据最后同步时间
            }
        );
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        const data = this.createParams();
        if (couldDownLoad(this.state.dataSource) && this.validParams(data)) {
            downloadAchieveCenterExcel(data);
        }
    }
}

export default AchievementCenter;
