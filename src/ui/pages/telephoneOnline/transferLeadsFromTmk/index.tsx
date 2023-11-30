/**
 * desc: TMK转到该中心的leads
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/8/13
 * Time: 下午1:48
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {getTmkTransferLeadsList} from "@redux-actions/telephone/tmkTransferLeads";
import {User} from "@/common/beans/user";
import {TablePagination} from "@/ui/component/tablePagination";
import moment from 'moment';
import {appearanceTypeList} from "@/ui/pages/report/enum";
import {recordTelephoneMembers} from "@redux-actions/telephone/callLeads";
import {Routes} from "@/router/enum/routes";
import {ShowPhone} from "@/ui/pages/telephoneOnline/transferLeadsFromTmk/part/showPhone";

class TransferLeadsFromTmk extends React.Component<any, any>{
    private routes:Array<any> = [
        {
            name: '云语音',
            path: '',
            link: '#',
            id: 'telephone'
        },{
            name: 'TMK转入Leads明细',
            path: '',
            link: '#',
            id: 'transferToLeadsFromTmk'
        }
    ];
    private searchConfig:Array<any> = [
        {
            type: 'text',
            label: '宝宝姓名',
            name: 'babyName',
            placeholder: '请输入'
        },{
            type: 'dates',
            label: '创建时间',
            name: {
                start: 'leadsCreateDateBegin',
                end: 'leadsCreateDateEnd'
            },
        },{
            type: 'dates',
            label: '转中心时间',
            name: {
                start: 'transferIntoMateTimeBegin',
                end: 'transferIntoMateTimeEnd'
            },
        },{
            type: 'text',
            label: '手机号码',
            name: 'phone',
            placeholder: '请输入'
        },{
            type: 'text',
            label: '渠道编号',
            name: 'activityCode',
            placeholder: '请输入'
        },{
            type: 'select',
            label: '出现方式',
            name: 'appearanceType',
            placeholder: '请输入',
            options: appearanceTypeList
        },{
            type: 'text',
            label: '渠道名称',
            name: 'theme',
            placeholder: '请输入'
        },{
            type: 'text',
            label: '渠道备注',
            name: 'channelComment',
            placeholder: '请输入'
        },{
            type: 'text',
            label: 'promoter',
            name: 'promoter',
            placeholder: '请输入'
        },
    ];
    private columns = [
        {
            title: "宝宝姓名",
            dataIndex: 'babyName',
        },{
            title: "渠道编号",
            dataIndex: 'activityCode',
        },{
            title: "出现方式",
            dataIndex: 'appearanceTypeValue',
        },{
            title: "渠道名称",
            dataIndex: 'theme',
        },{
            title: "渠道备注",
            dataIndex: 'channelComment',
        },{
            title: "promotor",
            dataIndex: 'promoterName',
        },{
            title: "TMK",
            dataIndex: 'tmkStaffName',
        },{
            title: "月龄",
            dataIndex: 'monthValue',
        },{
            title: "创建时间",
            dataIndex: 'tmkLeadsCreateDate',
            render: (date:number) => moment(date).format('YYYY-MM-DD')
        },{
            title: "转中心时间",
            dataIndex: 'transferIntoMateTime',
            render: (date:number) => moment(date).format('YYYY-MM-DD')
        },{
            title: "手机号码",
            dataIndex: 'phone',
            render: (text:string, record:any) => <ShowPhone text={text} id={record.contactId}/>
        },{
            title: "操作",
            dataIndex: 'action',
            render: (text,record) => {
                if(record.phase === '0' || record.phase === '1' || record.phase === '2'){
                    return null
                }
                return <button className='gym-button-white gym-button-xxs' onClick={() => this.handleCall(record)}>拨号</button>
            }
        },
    ];
    constructor(props:any){
        super(props);
        this.state = {
            dataSource: [],
            totalSize: 0,
            pageSize: 10,
            pageNo:1,
            babyName: null,
            leadsCreateDateBegin: null,
            leadsCreateDateEnd:null,
            transferIntoMateTimeBegin:null,
            transferIntoMateTimeEnd:null,
            phone:null,
            activityCode:null,
            appearanceType:null,
            theme:null,
            channelComment:null,
            promoter:null
        }
    }
    componentDidMount(){
        this.queryList();
    }

    /**
     * 获取数据
     */
    queryList = () => {
        const {
            pageNo, pageSize, babyName, leadsCreateDateBegin,
            leadsCreateDateEnd, transferIntoMateTimeBegin,
            transferIntoMateTimeEnd, phone, activityCode,
            appearanceType, theme, channelComment, promoter
        } = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            pageNo,pageSize,
            babyName, leadsCreateDateBegin,
            leadsCreateDateEnd, transferIntoMateTimeBegin,
            transferIntoMateTimeEnd, phone, activityCode,
            appearanceType, theme, channelComment, promoter
        };
        getTmkTransferLeadsList(param).then((res:any) => {
            this.setState({
                totalSize: res.totalSize,
                dataSource: res.list
            })
        })
    };
    /**
     * 条件搜索
     */
    onSearch = (values:any) => {
        this.setState({
            pageNo:1,
            ...values,
            transferIntoMateTimeBegin: values.transferIntoMateTimeBegin && values.transferIntoMateTimeBegin.valueOf(),
            transferIntoMateTimeEnd: values.transferIntoMateTimeEnd && values.transferIntoMateTimeEnd.valueOf(),
            leadsCreateDateBegin: values.leadsCreateDateBegin && values.leadsCreateDateBegin.valueOf(),
            leadsCreateDateEnd: values.leadsCreateDateEnd && values.leadsCreateDateEnd.valueOf(),
        },this.queryList);
    };
    /**
     * 分页
     */
    handleChangePage  = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
        }, this.queryList);
    };
    /**
     * 拨打电话
     */
    handleCall = (record:any) => {
        recordTelephoneMembers([record.leadsId]);
        window.open(Routes.语音拨打.path, 'call');
    };
    render(){
        const {dataSource, totalSize, pageNo, pageSize} = this.state;
        return(
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div className="page-wrap">
                    <SearchForm
                        items={this.searchConfig}
                        onSearch={this.onSearch}
                    />
                    <TablePagination
                        dataSource={dataSource}
                        columns={this.columns}
                        totalSize={totalSize}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        rowKey="leadsId"
                        handleChangePage={this.handleChangePage}
                    />
                </div>
            </Fragment>
        )
    }
}

export {TransferLeadsFromTmk}
