/**
 * desc: 市场渠道业绩报表的公共模板
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/17
 * Time: 上午10:38
 */
import React, {Component, Fragment} from 'react';
import moment from "moment";
import {message} from "antd";
import {chunk} from 'lodash';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PageTitle} from "@/ui/component/pageTitle";
import MarketAchieveSearchTable from "./marketAchieveSearchTable";
import SearchCollapse from './seachCollapse';
import {marketDataOptionList, selectType} from "../enum";
import FullScreen from './fullScreen';
import MarketAchieveSearchResult from "./marketAchieveSearchResult";
import {getChannelType} from "@redux-actions/report/marketReport";
import {User} from "@/common/beans/user";
import {couldDownLoad, watchTableScroll} from "../common";

const dataOptionValueList = marketDataOptionList.map(item => item.value);

export class AchievementMarket extends Component<any, any> {
    private loadNum = 20;   // 每次滚动加载的表格数据
    private page = 0;       // 滚动加载表格数据的下标
    private watchTableScroll: any;

    // 每次滚动加载的表格数据
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: this.props.breadCrumbRoutes || [],
            dataOptions: marketDataOptionList,
            channelTypeOptions: [],
            dataSource: [],                         // 需要展示到表格中的中心业绩报表数据
            allDataSource: [],                      // 中心业绩表报数据
            beginDate: moment(),
            endDate: moment(),                      // 查询时间
            channelComment: '',                         // 评论内容
            showChannelComment: false,                  // 是否显示表格的渠道备注字段，默认不显示
            selectedData: dataOptionValueList,          // 已选择的数据项，默认全选
            selectedChannelType: [],                    // 选中的渠道来源
            selectedDataAll: true,                      // 全选数据项，默认全选
            selectedChannelTypeAll: false,              // 全选渠道来源，默认不全选
            lastSyncDatetime: null,                     // 数据最后同步时间
        };

        this.watchTableScroll = watchTableScroll.bind(this);    // 监视表格滚动的方法，需要绑定当前组件的this
    }

    render() {
        const {
            breadCrumbRoutes, dataOptions, dataSource, selectedData, endDate, channelComment,
            channelTypeOptions, selectedChannelType, selectedDataAll, selectedChannelTypeAll,
            lastSyncDatetime, showChannelComment,beginDate
        } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes}/>
                <SearchCollapse handleSearch={this.getMarketAchievementData} handleReset={this.handleReset}>
                    <MarketAchieveSearchTable
                        dataOptions={dataOptions}
                        channelTypeOptions={channelTypeOptions}
                        selectedData={selectedData}
                        selectedChannelType={selectedChannelType}
                        selectedDataAll={selectedDataAll}
                        selectedChannelTypeAll={selectedChannelTypeAll}
                        beginDate={beginDate}
                        endDate={endDate}
                        channelComment={channelComment}
                        selectItem={this.handleSelectItem}
                        handleSelectStartTime={this.handleSelectStartTime}
                        handleSelectEndTime={this.handleSelectEndTime}
                        selectAll={this.handleSelectAll}
                        handleTextChange={this.handleTextChange}
                    />
                </SearchCollapse>
                <div className="page-wrap gym-report-wrap">
                    <PageTitle title="查询结果" className="gym-report-result-title"/>
                    <FullScreen
                        handleDownLoadExcel={this.handleDownLoadExcel}
                        lastSyncDatetime={lastSyncDatetime}
                        canDownload={dataSource && dataSource.length > 0}
                    >
                        <MarketAchieveSearchResult
                            dataSource={dataSource}
                            selectedData={selectedData}
                            showChannelComment={showChannelComment}
                            dataOptionList={marketDataOptionList}
                        />
                    </FullScreen>
                </div>
            </Fragment>
        )
    }

    componentDidMount() {
        // 页面加载时首先获取渠道来源数据
        getChannelType().then(res => {
            this.setState({
                channelTypeOptions: res
            })
        })
    }
    handleSelectStartTime = (value: moment.Moment) => {
        this.setState({
            beginDate: value
        })
    };
    /**
     * 选择查询月份
     * @param value 选择的查询月份
     */
    handleSelectEndTime = (value: moment.Moment) => {
        this.setState({
            endDate: value
        })
    };

    /**
     * 选择多选框条目
     * @param value Array<string> 选中的多选框列表
     * @param type string 多选框类型
     */
    handleSelectItem = (value: Array<string>, type) => {
        const {dataOptions, channelTypeOptions} = this.state;

        // 设置选中的条目
        this.setState({
            [type]: value
        });
        // 根据选中条目的数量，标记全选按钮
        switch (type) {
            case selectType.选取渠道来源:
                this.setState({
                    selectedChannelTypeAll: value.length === channelTypeOptions.length
                });
                break;
            case selectType.选取数据项:
                this.setState({
                    selectedCityAll: value.length === dataOptions.length
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
        const {dataOptions, channelTypeOptions} = this.state;
        if (checked) {
            switch (name) {
                case selectType.选取数据项:
                    this.countSelectedValue(dataOptions, name);
                    break;
                case selectType.选取渠道来源:
                    this.countSelectedValue(channelTypeOptions, name);
                    break;
                default:
                    break;
            }
        } else {
            this.setState({
                [name]: []
            })
        }

        // 设置或取消全选标记
        this.setState({
            [`${name}All`]: checked
        })
    };

    /*全选时计算选中的value数组*/
    countSelectedValue = (list: Array<any>, name: string) => {
        const arr = list.map(item => item.value);
        this.setState({
            [name]: arr
        })
    };

    /*设置渠道备注的值*/
    handleTextChange = (e) => {
        this.setState({
            channelComment: e.target.value,
        })
    };

    /**
     * 生成查询参数
     * @return object 参数对象
     */
    createParams = () => {
        const {endDate, selectedChannelType, channelComment, selectedData, beginDate} = this.state;
        return {
            currentCenterId: User.currentCenterId,
            beginDate:beginDate ? moment(beginDate).valueOf() : endDate,
            endDate: endDate ? moment(endDate).valueOf() : endDate,
            channelType: selectedChannelType.join() || undefined,
            channelComment,
            column: selectedData.join() || undefined
        };
    };

    /**
     * 验证查询参数
     * @param params 查询参数
     * @return boolean true为通过校验 false为未通过校验
     */
    validParams = (params) => {
        if (!params.column) {
            message.error('请至少选择一个数据项！');
            return false;
        }
        if (!params.channelType) {
            message.error('请至少选择一个渠道来源！');
            return false;
        }
        return true;
    };

    /*获取业绩数据*/
    getMarketAchievementData = () => {
        const data = this.createParams();
        const {channelComment} = this.state;
        // 首先校验参数
        if(this.validParams(data)){
            this.props.getData(data).then(res => {
                const {lastSyncDatetime, list} = res;
                if (lastSyncDatetime || list) {
                    // 数据量过大时，分段展示表格，把数据按照设定的每页条数分组
                    const allDataSource = chunk((list || []), this.loadNum);
                    this.page = 0;  // 重置下标
                    this.setState(
                        {
                            dataSource: allDataSource[this.page] || [],     // 先加载第一段数据
                            allDataSource,
                            lastSyncDatetime: lastSyncDatetime || Date.now(),
                            showChannelComment: channelComment.length > 0
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

    handleReset = () => {
        this.setState(
            {
                endDate: moment(),                // 结束时间
                channelComment: '',                         // 评论内容
                showChannelComment: false,                  // 是否显示表格的渠道备注字段，默认不显示
                selectedData: dataOptionValueList,          // 已选择的数据项，默认全选
                selectedChannelType: [],                    // 选中的渠道来源
                selectedDataAll: true,                      // 全选数据项，默认全选
                selectedChannelTypeAll: false,              // 全选渠道来源，默认不全选
                lastSyncDatetime: null,                     // 数据最后同步时间
            }
        )
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        const data = this.createParams();
        if (couldDownLoad(this.state.dataSource) && this.validParams(data)) {
            this.props.download(data);
        }
    };
}
