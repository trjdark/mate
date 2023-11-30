/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/17
 * Time: 下午7:36
 */
import React from 'react'
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {TablePagination} from "@/ui/component/tablePagination";
import {CommonUtils} from "@/common/utils/commonUtils";
import {queryLeadsCallRecords} from "@redux-actions/customer/customerAcquire";
import {User} from "@/common/beans/user";
import moment from "moment";
import {downloadRecordsFile} from "@redux-actions/telephone/callRecords";

class CallRecords extends React.Component<any, any>{
    private routes:Array<any> = [
        {
            name: '客户',
            path: '',
            link: '#',
            id: 'setting'
        },{
            name: '客户360',
            path: '',
            link: '#',
            id: 'client360'
        },{
            name: '电话录音',
            path: '',
            link: '#',
            id: 'callRecords'
        }
    ];
    leadsId:string;
    columns:Array<any>;
    constructor(props:any){
        super(props)
        if(CommonUtils.hasParams(props)){
            this.leadsId = CommonUtils.parse(props).leadsId;
        }
        this.state = {
            pageNo:1,
            pageSize: 10,
            dataSource: [],
            totalSize: 0
        }
        this.columns = [
            {
                title: "通话时间",
                dataIndex: 'createDate',
                render: (time:number) => moment(time).format("YYYY-MM-DD HH:mm")
            },{
                title: "跟进人员",
                dataIndex: 'createByName',
            },{
                title: "通话时长",
                dataIndex: 'durationFormat',
            },{
                title: "通话类型",
                dataIndex: 'talkType',
                render: (text:string) => this.talkTypeFormat(text)
            },{
                title: "联系人",
                dataIndex: 'familyRelationship',
            },{
                title: "手机号码",
                dataIndex: 'called',
            },{
                title: "归属地",
                dataIndex: 'phonePlace',
            }
        ]
    }
    componentDidMount(){
        this.getLeadsCallRecord();
    }
    getLeadsCallRecord = () => {
        const {pageNo, pageSize} = this.state;
        queryLeadsCallRecords({
            currentCenterId: User.currentCenterId,
            leadsId: this.leadsId,
            pageNo,
            pageSize
        }).then((res) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    };
    talkTypeFormat = (type:string) => {
        const map = new Map([
            ["94001","空号"],
            ["94002","未接通"],
            ["94003","已接通"],
            ["94004","客户挂断"]
        ])
        return map.get(type);
    };
    downloadRecords = (fileId:string) => {
        downloadRecordsFile({
            currentCenterId: User.currentCenterId,
            fileId: fileId,
        })
    };
    handlePage = (pageInfo) => {
        this.setState(pageInfo, this.getLeadsCallRecord)
    };
    render(){
        const {dataSource, totalSize, pageSize, pageNo} = this.state;
        let newColumns = (User.role.includes('CD') || User.role.includes('HGA') || User.role.includes('HGB'))
            ? [...this.columns, {
                title: "电话录音",
                dataIndex: 'recordingUrl',
                render: (text:string) => text && <button className="gym-button-xxs gym-button-white" onClick={() => this.downloadRecords(text)}>下载</button>
            }]
            : [...this.columns];
        return(
            <div id="gym-client360-call-Records">
                <BreadCrumb routes={this.routes}/>
                <div className="page-wrap">
                    <TablePagination
                        dataSource={dataSource}
                        columns={newColumns}
                        pageSize={pageSize}
                        pageNo={pageNo}
                        rowKey="id"
                        totalSize={totalSize}
                        handleChangePage={this.handlePage}
                    />
                </div>
            </div>
        )
    }
}

export {CallRecords}
