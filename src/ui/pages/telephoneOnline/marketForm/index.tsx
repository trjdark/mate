/**
 * desc: 市场类报表
 * User: Vicky.yu
 * Date: 2020/8/28
 * Time: 10:00
 */
import React, { Fragment } from 'react';
import {User} from "@/common/beans/user";
import {TablePagination} from "@/ui/component/tablePagination";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import { getMarketListDetail, exportMarket } from "@redux-actions/telephone/marketDetail";
import {SearchForm} from "@/ui/component/searchForm";
import { appearanceTypeList } from "../../report/enum";
import { Tooltip } from "@/ui/component/toolTip";
import moment from 'moment';
import { getChannelType } from "@redux-actions/report/marketReport";
import { cloneDeep } from 'lodash';
import { getGbInJobSList } from "@redux-actions/report/marketReport";
import FullScreen from '../../report/components/fullScreen';
import '../style/teleForm.scss';
import { formatter } from "../../report/common";

class TeleMarketForm extends React.Component<any, any>{
    private routes: Array<any> = [
        {
            name: '云语音',
            path: '',
            link: '#',
            id: 'tele'
        }, {
            name: '市场名单明细',
            path: '',
            link: '#',
            id: 'market-detail'
        }
    ];
    private columns = [
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
            title: '跟进TMK',
            dataIndex: 'tmkStaffName',
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
            title: '首次分配',
            dataIndex: 'distributeTime',
            render: text => text ? moment(text).format(formatter) : '',
        },
        {
            title: '首次联系',
            dataIndex: 'vleadsTime',
            render: text => text ? moment(text).format(formatter) : '',
        },
        {
            title: '首次诺访',
            dataIndex: 'appTime'
        },
        {
            title: '试听时间',
            dataIndex: 'previewDate',
            render: text => text ? moment(text).format(formatter) : '',
        },
        {
            title: '签约时间',
            dataIndex: 'signDate',
            render: text => text ? moment(text).format(formatter) : '',
        },
        {
            title: '到访时间',
            dataIndex: 'oppTime',
            render: text => text ? moment(text).format(formatter) : '',
        },
        {
            title: '是否再次获取',
            dataIndex: 'reacquire',
        },
        {
            title: 'GB接通次数',
            dataIndex: 'tmkCallSuccessCount'
        },
        {
            title: 'GB已拨未接次数',
            dataIndex: 'unansweredTimes',
        },
        {
            title: 'GB通话时长',
            dataIndex: 'duration',
        },
        {
            title: 'GB最近通话日期',
            dataIndex: 'lastCallTime'
        }
    ];
    constructor(props: any) {
        super(props);
        this.state = {
            dataSource: [],
            totalSize: 0,
            pageSize: 10,
            pageNo: 1,
            appearanceType: undefined,  // 渠道出现方式
            channelComment: undefined,  // 渠道备注
            channelType: undefined,     // 渠道来源
            primaryStaffId: undefined,  // 成长伙伴
            theme: undefined,           // 渠道名称
            tmkCallSuccessCount: null, // 接通次数
            unansweredTimes: null,      // 已拨未接次数
            duration: null,             // 通话时长
            createDate: [moment(), moment()],      // 创建日期
            lastCallTimeBegin: null,
            lastCallTimeEnd: null,
            reacquire: null,
            inquireDateBeg:moment().startOf('day').valueOf(),
            inquireDateEnd:moment().endOf('day').valueOf(),
            searchConfig:[
                {
                    type: 'rangePicker',
                    label: this.props.rangePickerLabel || '获取时间',
                    name: 'date',
                    initialValue: [moment(), moment()],
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
                    options: []
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
                    options: []
                },
                {
                    type: 'select',
                    label: '是否再次获取',
                    name: 'reacquire',
                    initialValue: null,
                    options: [{ postName: '再次获取Leads', postCode: '1' }, { postName: '新Leads', postCode: '0' }, { postName: '合计', postCode: null }]
                },
                {
                    type: 'rangePicker',
                    label: '最近通话日期',
                    name: 'callDates'
                }, {
                    type: 'number',
                    label: '接通次数',
                    name: 'tmkCallSuccessCount',
                    props: {
                        min: 0,
                        max: 99999,
                        precision: 0,
                        formatter: value => {
                            return Number.isNaN(+value) ? '' : value;
                        }
                    },
                }, {
                    type: 'number',
                    label: '已拨未接次数>=',
                    colon: false,
                    name: 'unansweredTimes',
                    props: {
                        min: 0,
                        max: 99999,
                        precision: 0,
                        formatter: value => {
                            return Number.isNaN(+value) ? '' : value;
                        }
                    },
                }, {
                    type: 'number',
                    label: '通话时长(秒)>=',
                    colon: false,
                    name: 'duration'
                }
            ]
        }
    }
    componentDidMount() {
        this.queryList();
        this.getPrimaryStaffData();
        this.getChannelTypeList();

    }

    /**
     * 获取数据
     */
    queryList = () => {
        const {
            pageNo, pageSize,
            appearanceType, reacquire,
            channelComment, channelType,
            primaryStaffId, theme,
            createDateBeg, createDateEnd, inquireDateBeg, inquireDateEnd,
            tmkCallSuccessCount, lastCallTimeBegin, lastCallTimeEnd,
            unansweredTimes, duration
        } = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            pageNo, pageSize,
            appearanceType, reacquire,
            channelComment, channelType,
            primaryStaffId, theme,
            createDateBeg, createDateEnd, inquireDateBeg, inquireDateEnd,
            tmkCallSuccessCount, lastCallTimeBegin, lastCallTimeEnd,
            unansweredTimes, duration
        };
        getMarketListDetail(param).then((res: any) => {
            this.setState({
                totalSize: res.totalSize,
                dataSource: res.list
            })
        })
    };
    /**
     * 条件搜索
     */
    onSearch = (values: any) => {
        values.inquireDateBeg = values.date ? moment(values.date[0]).valueOf() : null,
        values.inquireDateEnd = values.date ? moment(values.date[1]).valueOf() : null,
        values.lastCallTimeBegin = values.callDates ? moment(values.callDates[0]).valueOf() : null
        values.lastCallTimeEnd = values.callDates ? moment(values.callDates[1]).valueOf() : null
        this.setState({
            pageNo: 1,
            ...values,
        }, this.queryList);
    };
    // 导出
    handleDownLoadExcel = () => {
        const {
            pageNo, pageSize, appearanceType,
            channelComment, channelType,
            primaryStaffId, theme, reacquire,
            createDateBeg, createDateEnd, inquireDateBeg, inquireDateEnd,
            tmkCallSuccessCount,
            unansweredTimes, duration
        } = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            pageNo, pageSize, appearanceType,
            channelComment, channelType,
            primaryStaffId, theme, reacquire,
            tmkCallSuccessCount,
            createDateBeg, createDateEnd, inquireDateBeg, inquireDateEnd,
            unansweredTimes, duration
        };
        exportMarket(param)
    };
    /**
     * 分页
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
        }, this.queryList);
    };
    /*获取渠道来源数据*/
    getChannelTypeList = () => {
        // 页面加载时首先获取渠道来源数据
        getChannelType().then(res => {
            const searchConfig = cloneDeep(this.state.searchConfig);
            const option = res.map((item)=>({postCode: item.value,postName: item.label}));
            for (let val of searchConfig) {
                if (val.name === 'channelType') {
                    val.options = option;
                }
            }
            this.setState({
                searchConfig
            });
        })
    };
    /*获取成长伙伴数据*/
    getPrimaryStaffData = () => {
        const data = {
            currentCenterId: User.currentCenterId,
        };

        getGbInJobSList(data).then(res => {
            const searchConfig = cloneDeep(this.state.searchConfig);
            // 设置到表单配置项
            for (let val of searchConfig) {
                if (val.name === 'primaryStaffId') {
                    val.options = res;
                }
            }
            this.setState({
                searchConfig
            });
        });
    };
    render() {
        const { dataSource, totalSize, pageNo, pageSize, lastSyncDatetime, searchConfig } = this.state;
        return (
            <Fragment >
                <BreadCrumb routes={this.routes} />
                <div className="page-wrap gym-tele-market-form">
                    <SearchForm
                        items={searchConfig}
                        onSearch={this.onSearch}
                    />
                    <FullScreen
                        lastSyncDatetime={lastSyncDatetime}
                        handleDownLoadExcel={this.handleDownLoadExcel}
                        canDownload={dataSource.length > 0}
                    >
                        <TablePagination
                            dataSource={dataSource}
                            columns={this.columns}
                            totalSize={totalSize}
                            pageNo={pageNo}
                            pageSize={pageSize}
                            scroll={{ x: 2500 }}
                            rowKey={`id`}
                            handleChangePage={this.handleChangePage}
                        />
                    </FullScreen>
                </div>
            </Fragment>
        )
    }
}
export {TeleMarketForm}
