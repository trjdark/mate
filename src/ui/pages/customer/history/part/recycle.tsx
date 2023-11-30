/**
 *Desc: 手动回收站
 *User: Debby.Deng
 *Date: 2018/11/2,
 *Time: 上午10:45
 */
import * as React from "react";
import {SearchForm} from "../../../../component/searchForm";
import {CommonRecords, WrappedComponent} from "./record";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {User} from "../../../../../common/beans/user";
import {recycleType} from "../../enum/assign";
import {form} from "../../../../../common/decorator/form";
import {historyDownload, manualRecycle, toUnassign, transferToTmk} from "@redux-actions/customer/historyList";
import {Message} from "../../../../component/message/message";
import {HistoryMultSelect} from "./historyMultSelect";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {getCodeInfoByType, hasTMKCenter} from "@redux-actions/customerCreate";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {Confirm} from "@/ui/component/customerCreateModal";
import moment from 'moment';

@form()
class Recycle extends React.Component<any,any> {
    constructor(props:any) {
        super(props)
        this.state = {
            query: {
                currentCenterId: User.currentCenterId,
                gaStaffIdList: [],
                gbStaffIdList: [],
                keyWord: '',
                recycleCause: '',
                timeType:'',
                remark: '',
                source: '',
                pageNo: 1,
                pageSize: 10,
            },
            selectedRowKeys: [],
            selectedRows: [],
            resData: {},
            ChannelTypeList: [],         //渠道列表
            appearnceTypeList: [],       //出现方式
            hasTmkCenter: null,          // 是否含有tmk中心
        };
    }
    componentDidMount() {
        this.getInfo();
    }
    handlePageChange = (page) => {
        this.resetState(page);
    };
    /**
     * 获取数据
     * @param values
     */
    handleSearch = (values) => {
        const {
            keyWord, recycleCause, remark, source, GA, GB,
            phone, appearanceType, channelType, monthBegin, monthEnd,
        } = values;
        const params = {
            gaStaffIdList: GA,
            gbStaffIdList: GB,
            keyWord: keyWord,
            recycleCause: recycleCause,
            remark: remark,
            source: source,
            pageNo: 1,
            pageSize: 10,
            inquireDateBegin: values.date ? moment(values.date[0]).startOf('day').valueOf() : null,
            inquireDateEnd: values.date ? moment(values.date[1]).endOf('day').valueOf() : null,
            recycleDateStart: values.recycleDate ? moment(values.recycleDate[0]).startOf('day').valueOf() : null,
            recycleDateEnd: values.recycleDate ? moment(values.recycleDate[1]).endOf('day').valueOf() : null,
            channelType, appearanceType,
            phone, monthBegin, monthEnd,
        };
        if(phone){
            const phoneReg = /^1[3456789]\d{9}$/;
            if (!phoneReg.test(phone)) {
                Message.error('请输入11位数的手机号码');
                return;
            }
        }
        this.resetState(params);
    };
    /**
     * 重置
     * @param params
     */
    resetState = (params) => {
        const query = Object.assign({}, this.state.query, params);
        manualRecycle(query).then((res) => {
            this.setState({resData: res, query: query, selectedRowKeys: []});
        });
    };
    /**
     * 导出
     * @returns {any}
     */
    handleDownload = () => {
        const {resData} = this.state;
        const query = Object.assign({}, this.state.query,
            {historyType: 'recycle', pageNo: null, pageSize: null});
        if (resData.list && resData.list.length > 0) {
            historyDownload(query);
        }
    };
    changeSelectFormat = (options) => {
        return (options || []).map((option) => {
            return {
                postCode: option.value,
                postName: option.label || option.name,
            }
        });
    };
    /**
     * 转移至待分配
     */
    toUnAssign = () => {
        const _this = this;
        const {selectedRowKeys, selectedRows} = this.state;
        if(selectedRows.some(item => item.tmkLock)){
            Message.warning("TMK跟进中,如需解锁，请联系跟进人", 3)
            return;
        }
        Confirm({
            content:<div><p className='size18 c333 mb10'>确定要手动激活？</p>激活后的leads会回到"<span className='cDefault'>待分配</span>"</div>,
            okText:'分配',
            cancelText:'取消',
            onOk(){
                toUnassign({
                    currentCenterId: User.currentCenterId,
                    leadsIdList: selectedRowKeys
                }).then(() => {
                    Message.success('转移至待分配成功');
                    _this.resetState({});
                })
            }
        })

    };
    /**
     * 转移至tmk
     */
    transferTmk = () => {
        transferToTmk({
            currentCenterId: User.currentCenterId,
            leadsIdList: this.state.selectedRowKeys
        }).then(() => {
            Message.success('转移至TMK成功');
            this.resetState({});
        })
    };
    /**
     * 行点击事件
     * @param  event
     * @param  record
     * @returns {any}
     */
    handleRowClick = (record) => {
        window.open(`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId: record.leadsId})}`)
    };

    /**
     * 初始化
     * @returns {Promise<void>}
     */
    getInfo = async () => {
        try{
            Promise.all([
                getCodeInfoByType({
                    type: 'ChannelType',
                    currentCenterId: User.currentCenterId
                }),
                getCodeInfoByType({
                    type: "appearnceType",
                    currentCenterId: User.currentCenterId
                }),
                hasTMKCenter({
                    currentCenterId: User.currentCenterId
                }),
            ]).then((res:any) => {
                this.setState({
                    ChannelTypeList: res[0].map((item) => ({
                            postCode: item.code,
                            postName: item.codeValue
                        })
                    ),
                    appearnceTypeList: res[1].map((item) => ({
                            postCode: item.code,
                            postName: item.codeValue
                        })
                    ),
                    hasTmkCenter: res[2].hasTmk
                })
            })

        }catch (e) {

        }
    };
    /**
     * 搜索配置
     * @returns {Array<any>}
     */
    searchItems = ():Array<any> => {
        const {ChannelTypeList, appearnceTypeList} = this.state;
        return [
            {
                label: '关键字',
                name: 'keyWord',
                type: 'text',
            },
            {
                label: '渠道来源',
                name: 'source',
                type: 'select',
                options: ChannelTypeList,
                popupContainer: '.gym-content',
            },
            {
                label: '渠道备注',
                name: 'remark',
                type: 'text',
            },
            {
                label: '回收原因',
                name: 'recycleCause',
                type: 'select',
                options: this.changeSelectFormat(recycleType),
                popupContainer: '.gym-content',
            },
            {
                label: '回收日期',
                name: 'recycleDate',
                type: 'rangePicker',
                initialValue: [moment().subtract(1, 'month'),moment()],
                popupContainer: '.gym-content',
            },
            {
                label: '出现方式',
                name: 'appearanceType',
                type: 'select',
                options: appearnceTypeList,
                popupContainer: '.gym-content',
            },
            {
                label: 'Leads标签',
                name: 'channelType',
                type: 'select',
                options: [
                    {postCode: "72033", postName: "vip权益"},
                    {postCode: "72034", postName: "C位萌主"},
                    {postCode: "72035", postName: "数据挖掘"},
                ],
                popupContainer: '.gym-content',
            }, {
                label: '选择月龄',
                type: 'ageInput',
                name: {
                    start: 'monthBegin',
                    end: 'monthEnd'
                },
            },{
                label: '获取时间',
                name: 'date',
                type: 'rangePicker',
                popupContainer: '.gym-content',
            },
        ];
    };
    render() {
        const {form} = this.props;
        const {resData, hasTmkCenter} = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selectedRowKeys, selectedRows});
            },
            selectedRowKeys: this.state.selectedRowKeys
        };
        const TableWrap = WrappedComponent(CommonRecords, 'recycle');
        const role = User.role;
        return (
            <div className='gym-customer-history'>
                <HistoryMultSelect form={form} showSearchBtn={false}/>
                <SearchForm items={this.searchItems()} form={form} onSearch={this.handleSearch}/>
                <p className='text-l mb20 ml30 clear'>
                    {
                        User.permissionList.includes(FUNC[`转移至待分配`]) &&
                        <button
                            className='gym-button-sm gym-button-default mr15'
                            onClick={this.toUnAssign}>转移至待分配</button>
                    }
                    {
                        hasTmkCenter &&
                        <button
                            className='gym-button-sm gym-button-default'
                            onClick={this.transferTmk} >转至TMK跟进</button>
                    }
                    <span className='ml25'>时间跨度大可能导致查询或导出失败，请分多段时间查询或导出。</span>
                    {CommonUtils.isInclude(role, ['BMS']) &&
                    <button className={`${resData.list && resData.list.length > 0 ?
                        `gym-button-default-sm` : 'gym-button-greyb-sm'}  fr`}
                            onClick={this.handleDownload}
                    >导出</button>}
                </p>
                <TableWrap
                    rowKey={`leadsId`}
                    resData={resData}
                    onRowSelection={rowSelection}
                    onPageChange={this.handlePageChange}
                    onRowClick={this.handleRowClick}
                />
            </div>
        )
    }
}

export {Recycle}
