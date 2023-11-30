/**
 * desc: 市场名单明细报表模板
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/17
 * Time: 上午10:38
 */
import React, {Component, Fragment} from 'react';
import moment from "moment";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import {Tooltip} from "@/ui/component/toolTip";
import FullScreen from './fullScreen';
import {formatter} from "../common";
import {User} from "@/common/beans/user";
import {appearanceTypeList} from "../enum";
import {couldDownLoad} from "../common";
import {getChannelType} from "@redux-actions/report/marketReport";
import MultiCenterExportButton from './multiCenterExportButton';
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import {connect} from "@/common/decorator/connect";


const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])
const gbOption = isPostTransRole
    ? {
        workingStatus: '1',
        roleList: ["GB","HGB"]
    }
    :{
        workingStatus: '1',
        postName: ["GB","HGB"]
    };

@connect((state) => ({
    gbList: selectTotalEmployeeList(state, gbOption),
}))

export class MarketDetail extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: this.props.breadCrumbRoutes || [],
            channelTypes: [],
            columns: [
                {
                    title: '客户编号',
                    dataIndex: 'customerCode',
                },
                {
                    title: '宝宝姓名',
                    dataIndex: 'babyName',
                },
                {
                    title: '月龄',
                    dataIndex: 'monthValue',
                },
                {
                    title: '成长伙伴',
                    dataIndex: 'primaryStaffName',
                },
                {
                    title: '出现方式',
                    dataIndex: 'appearanceTypeName',
                },
                {
                    title: '渠道来源',
                    dataIndex: 'channelTypeName',
                },
                {
                    title: '渠道备注',
                    dataIndex: 'channelComment',
                    width: 150,
                    render(text) {
                        if (!text) {
                            return '';
                        }

                        if (text.length > 20) {
                            return (
                                <Tooltip
                                    title={text}
                                    trigger="click"
                                >
                                    {`${text.slice(0, 18)}...`}
                                </Tooltip>
                            )
                        }

                        return text;
                    }
                },
                {
                    title: '渠道名称',
                    dataIndex: 'activityTheme',
                },
                {
                    title: 'Promotor',
                    dataIndex: 'promoterName',
                },
                {
                    title: '主要联系人/关系',
                    dataIndex: 'contactRelation',
                },
                {
                    title: '意向度',
                    dataIndex: 'intentionLevelName',
                },
                {
                    title: '阶段',
                    dataIndex: 'phaseName',
                },
                {
                    title: '获取时间',
                    dataIndex: 'inquireDate',
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                },
                {
                    title: '首次分配日期',
                    dataIndex: 'distributeTime',
                    render: text => text ? moment(text).format(formatter) : '',
                },
                {
                    title: '首次联系时间',
                    dataIndex: 'vleadsTime',
                },
                {
                    title: '首次联系成功时间',
                    dataIndex: 'firstContactTime',
                },
                {
                    title: '获取-首次联系间隔天数',
                    dataIndex: 'vleadsTimeAging',
                },
                {
                    title: '获取-首次成功联系间隔天数',
                    dataIndex: 'firstContactAging',
                },
                {
                    title: '试听日期',
                    dataIndex: 'previewDate',
                    render: text => text ? moment(text).format(formatter) : '',
                },
                {
                    title: '签约日期',
                    dataIndex: 'signDate',
                    render: text => text ? moment(text).format(formatter) : '',
                },
                {
                    title: '首次到访日期',
                    dataIndex: 'oppTime',
                    render: text => text ? moment(text).format(formatter) : '',
                },
                {
                    title: '是否再次获取',
                    dataIndex: 'reacquire',
                },
            ],             // 表单配置项
            dataSource: [],             // 数据项
            appearanceType: undefined,  // 渠道出现方式
            channelComment: undefined,  // 渠道备注
            channelType: undefined,     // 渠道来源
            createDate: [moment(),moment()],      // 创建日期
            primaryStaffId: undefined,  // 成长伙伴
            theme: undefined,           // 活动名
            lastSyncDatetime: null,     // 数据有效时间
            totalSize: 0,
            pageNo: 1,          // 页数
            pageSize: 10,       // 每页请求条数
            modalVisible:false, //是否展示中心选择模板
            previewDate: [],
            oppTime: [],
            signDate: []
        }
    }
    searchConfig = ():Array<any> => {
        const {gbList} = this.props;
        const {channelTypes} = this.state;
        return [
            {
                type: 'rangePicker',
                label: this.props.rangePickerLabel || '获取时间',
                name: 'createDate',
            },
            {
                type: 'text',
                label: '渠道备注',
                name: 'channelComment',
            },
            {
                type: 'text',
                label: '渠道名称',
                name: 'theme',
            },
            {
                type: 'select',
                label: '成长伙伴',
                name: 'primaryStaffId',
                options: (gbList || []).map((item: any) => ({ postCode: item.staffId, postName: `${item.englishName} ${item.chineseName}` }))
            },
            {
                type: 'select',
                label: '出现方式',
                name: 'appearanceType',
                options: appearanceTypeList
            },
            {
                type: 'select',
                label: '渠道来源',
                name: 'channelType',
                options: channelTypes
            },
            {
                type: 'select',
                label: '是否再次获取',
                name: 'reacquire',
                initialValue:null,
                options: [{postName: '再次获取Leads', postCode: '1'},{postName: '新Leads', postCode: '0'},{postName: '合计', postCode: null}]
            },
            {
                type: 'rangePicker',
                label:'首次到访日期',
                name: 'oppTime',
            },
            {
                type: 'rangePicker',
                label: '签约日期',
                name: 'signDate',
            },
            {
                type: 'rangePicker',
                label: '试听日期',
                name: 'previewDate',
            },
        ]
    };
    render() {
        const {
            breadCrumbRoutes, columns, dataSource,
            totalSize, pageNo, pageSize, lastSyncDatetime,
        } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes} />
                <div className="page-wrap">
                    <SearchForm
                        items={this.searchConfig()}
                        onSearch={this.onSearch}
                        onReset={this.onReset}
                    />
                    {User.permissionList.includes(this.props.exportPermission) &&
                        <div className='gym-report-multicenterexport-button'>
                            <MultiCenterExportButton
                                emitMultiCenterExport={this.handleMultiCenterExport}
                            />
                            <span className='desc'>多中心导出提交后，请前往单中心报表-下载已审批导出报表页面查看和下载！</span>
                        </div>
                    }
                    <FullScreen
                        lastSyncDatetime={lastSyncDatetime}
                        handleDownLoadExcel={this.handleDownLoadExcel}
                        canDownload={dataSource.length > 0}
                    >
                        <TablePagination
                            columns={columns}
                            dataSource={dataSource}
                            scroll={{ x: 2700 }}
                            totalSize={totalSize}
                            pageNo={pageNo}
                            pageSize={pageSize}
                            rowKey={item => item.id}
                            handleChangePage={this.handleChangePage}
                        />
                    </FullScreen>
                </div>
            </Fragment>
        );
    }

    componentDidMount() {
        // 获取渠道来源数据
        this.getChannelTypeList();
    }

    /*获取渠道来源数据*/
    getChannelTypeList = () => {
        // 页面加载时首先获取渠道来源数据
        getChannelType().then(res => {
            this.setState({
                channelTypes: (res || []).map( item => ({postCode: item.value, postName: item.label}))
            })
        })
    };

    /*获取市场名单明细*/
    getMarketDetailData = () => {
        // 生成查询参数
        const data = this.props.createParams.call(this, true);
        // 请求数据
        this.props.getData(data).then(res => {
            this.setState({
                dataSource: res.list || [],
                pageNo: res.pageNo,
                totalSize: res.totalSize,
                pageSize: res.pageSize,
                lastSyncDatetime: Date.now(),     // 数据实时查询，截止到当前有效
            })
        })
    };

    /*查询数据*/
    onSearch = (data) => {
        this.setState(
            {
                ...data,
                pageNo: 1,
                totalSize: 0,
            },
            this.getMarketDetailData,
        );
    };

    /*重置查询条件*/
    onReset = (data) => {
        this.setState(
            {
                ...data,
            },
        )
    };

    /*翻页*/
    handleChangePage = (data) => {
        this.setState(
            {
                pageNo: data.pageNo,
                pageSize: data.pageSize,
            },
            this.getMarketDetailData,
        );
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        if (couldDownLoad(this.state.dataSource)) {
            // 生成查询数据
            const data = this.props.createParams.call(this, false);
            // 下载
            this.props.download(data);
        }
    };

    //多中心导出
    handleMultiCenterExport = (isCheckedCenter) => {
        const data = this.props.createParams.call(this, true);
        const params = Object.assign({},data,{centerCodeList:isCheckedCenter,primaryStaffId:null});
        this.props.export(params)
    };
}
