/**
 * desc: 渠道出现方式业绩统计模板
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/2/18
 * Time: 下午14：40
 */
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {chunk} from 'lodash';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import SearchCollapse from '../components/seachCollapse';
import FullScreen from '../components/fullScreen';
import {User} from "@/common/beans/user";
import {PageTitle} from "@/ui/component/pageTitle";
import MarketStyleSearchTable from "../components/marketStyleSearchTable";
import MarketStyleSearchResult from "../components/marketStyleSearchResult";
import {marketStyleDataOptionList, selectType} from "../enum";
import {getChannelType} from "@redux-actions/report/marketReport";
import {couldDownLoad, watchTableScroll} from "../common";
import {message} from "antd";

const dataOptionValueList = marketStyleDataOptionList.map(item => item.value);

class AchievementChannelStyle extends Component<any, any> {
    private loadNum = 20;   // 每次滚动加载的表格数据
    private page = 0;       // 滚动加载表格数据的下标
    private watchTableScroll: any;

    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: this.props.breadCrumbRoutes || [],
            dataOptions: marketStyleDataOptionList,
            channelTypeOptions: [],
            dataSource: [],                         // 需要展示到表格中的中心业绩报表数据
            allDataSource: [],                      // 中心业绩表报数据
            inquireDate: moment(),                      // 查询日期
            beginDate:moment(),                         // 开始日期（月）
            endDate:moment(),                           // 结束日期 （月）
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
            breadCrumbRoutes, dataOptions, dataSource, selectedData, inquireDate, channelComment,
            channelTypeOptions, selectedChannelType, selectedDataAll, selectedChannelTypeAll,
            lastSyncDatetime, showChannelComment, beginDate, endDate
        } = this.state;

        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes}/>
                <SearchCollapse handleSearch={this.getAchievementMarketStyleData} handleReset={this.handleReset}>
                    <MarketStyleSearchTable
                        dataOptions={dataOptions}
                        channelTypeOptions={channelTypeOptions}
                        selectedData={selectedData}
                        selectedChannelType={selectedChannelType}
                        selectedDataAll={selectedDataAll}
                        selectedChannelTypeAll={selectedChannelTypeAll}
                        inquireDate={inquireDate}
                        beginDate={beginDate}
                        endDate={endDate}
                        channelComment={channelComment}
                        selectItem={this.handleSelectItem}
                        handleSelectInquireTime={this.handleSelectInquireTime}
                        handleSelectBeginTime={this.handleSelectBeginTime}
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
                        canDownload={dataSource.length > 0}
                    >
                        <MarketStyleSearchResult
                            dataSource={dataSource}
                            selectedData={selectedData}
                            showChannelComment={showChannelComment}
                            dataOptionList={marketStyleDataOptionList}
                        />
                    </FullScreen>
                </div>
            </Fragment>
        );
    }

    componentDidMount() {
        getChannelType().then(res => {
            this.setState({
                channelTypeOptions: res
            })
        });
    }

    /**
     * 选择查询月份
     * @param value 选择的月份
     */
    handleSelectInquireTime = (value: moment.Moment) => {
        this.setState({
            inquireDate: value
        })
    };
    /**
     * 选择查询月份
     * @param value 选择的月份
     */
    handleSelectBeginTime = (value: moment.Moment) => {
        this.setState({
            beginDate: value
        })
    };
    /**
     * 选择查询月份
     * @param value 选择的月份
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

    /*生成查询参数*/
    createParams = () => {
        const {inquireDate, channelComment, selectedChannelType, selectedData, beginDate, endDate} = this.state;
        return {
            currentCenterId: User.currentCenterId,
            queryDate: inquireDate ? moment(inquireDate).valueOf() : inquireDate,
            beginDate: beginDate ? moment(beginDate).valueOf() : beginDate,
            endDate: endDate ? moment(endDate).valueOf() : endDate,
            channelSourceList: selectedChannelType,
            channelRemark: channelComment,
            exportColumns: selectedData.join()
        }
    };

    /**
     * 验证查询参数
     * @param params 查询参数
     * @return boolean true为通过校验 false为未通过校验
     */
    validParams = (params) => {
        if (!params.exportColumns) {
            message.error('请至少选择一个数据项！');
            return false;
        }
        if (!params.channelSourceList.length) {
            message.error('请至少选择一个渠道来源！');
            return false;
        }
        return true;
    };

    /*获取渠道出现方式业绩统计数据*/
    getAchievementMarketStyleData = () => {
        const params = this.createParams();
        const {channelComment} = this.state;
        if(this.validParams(params)){
            this.props.getData(params).then(res => {
                const {lastSyncDatetime, list} = res;
                if (lastSyncDatetime || list) {
                    // 数据量过大时，分段展示表格，把数据按照设定的每页条数分组
                    const allDataSource = chunk((list || []), this.loadNum);
                    this.page = 0;  // 重置下标
                    this.setState(
                        {
                            dataSource: allDataSource[0] || [],   // 先加载第一段数据
                            lastSyncDatetime: lastSyncDatetime || Date.now(),
                            allDataSource,
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
                inquireDate: moment(),                      // 查询日期
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
        const params = this.createParams();
        if (couldDownLoad(this.state.dataSource) && this.validParams(params)) {
            this.props.download(params);
        }
    };
}

export {AchievementChannelStyle};
