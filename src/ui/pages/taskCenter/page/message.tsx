/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/8/17
 * Time: 上午9:17
 */
 import React, {Fragment} from 'react';
 import {BreadCrumb} from "@/ui/component/breadcrumb";
 import {TablePagination} from "@/ui/component/tablePagination";
 import {SearchForm} from "@/ui/component/searchForm";
 import {getMessageList} from "@redux-actions/taskCenter";
 import {User} from "@/common/beans/user";
 import moment from 'moment';
 import {ShowSystemDetailButton} from "@/ui/pages/taskCenter/part/showSystemDetailButton";

 class MessageCenter extends React.Component<any, any>{
     private breadCrumbRoutes = [
         {
             path: 'first',
             name: '工作台',
             id: '',
             link: ''
         }, {
             path: 'second',
             name: '消息中心',
             id: '',
             link: ''
         }
     ];
     constructor(props:any){
         super(props)
         this.state = {
             dataSource: [],
             totalSize: 0,
             pageNo: 1,
             pageSize: 10,
             noticeTheme:null,
             babyName:null,
             startTime: moment().startOf('month').valueOf(),
             endTime:moment().valueOf(),
         }
     }
     searchConfig = ():Array<any> => {
         const config = [
             {
                 type: 'select',
                 label: '主题',
                 name: 'noticeTheme',
                 placeholder: '请输入',
                 options: [
                     {postCode:'192001',postName: '首课提醒'},
                     {postCode:'192002',postName: '首课再次提醒'},
                     {postCode:'192005',postName: '旷课提醒'},
                     {postCode:'192006',postName: '升班提醒'},
                     {postCode:'192008',postName: '请假提醒'},
                     {postCode:'192012',postName: '排队约课成功提醒'},
                     {postCode:'192017',postName: '非活跃会员提醒'},
                     {postCode:'192011',postName: '换课提醒'}
                 ]
             },
             {
                 type: 'text',
                 label: '服务对象',
                 name: 'babyName',
                 placeholder: '请输入',
             },
             {
                 type: 'rangePicker',
                 label: '查询日期',
                 name: 'date',
                 initialValue: [moment().startOf('month'), moment()]
             },
             {
                 type: 'select',
                 label: '状态',
                 name: 'readStatus',
                 placeholder: '请输入',
                 options: [
                     {postCode: 0,postName: '未读'},
                     {postCode: 1,postName: '已读'},
                 ]
             },
         ];
         return config;
     };
     private columns = [
         {
             title: '类型',
             dataIndex: 'noticeType',
             width: 100,
             render(text, record) {
                 const config = {
                     '191001': '系统消息',
                 };
                 return  <span className={`${record.readStatus === 0 ? 'cDefault' : ''}`}>{config[text]}</span>;
             }
         }, {
             title: '主题',
             dataIndex: 'noticeTheme',
             width: 200,
             render(text, record) {
                 const config = {
                     '192001': '首课提醒',
                     '192002': '首课再次提醒',
                     '192005': '旷课提醒',
                     '192006': '升班提醒',
                     '192008': '请假提醒',
                     '192012': '排队约课成功提醒',
                     '192017': '非活跃会员提醒',
                     '192011': '换课提醒',
                 };
                 return <span className={`${record.readStatus === 0 ? 'cDefault' : ''}`}>{config[text]}</span>;
             }
         },{
             title: '服务对象',
             dataIndex: 'serviceBaby',
             width: 200,
             render: (text, record) => <span className={`${record.readStatus === 0 ? 'cDefault' : ''}`}>{text}</span>
         }, {
             title: '任务时间',
             width: 215,
             dataIndex: 'noticeDate',
             render: (text: number, record: any) => <span className={`${record.readStatus === 0 ? 'cDefault' : ''}`}>
                 {`${moment(text).format('YYYY-MM-DD')} ${record.noticeTime}`}
                 </span>
         }, {
             title: '发起人',
             dataIndex: 'sponsor',
             width: 120,
             render: (text, record) => (
                 <span className={`${record.readStatus === 0 ? 'cDefault' : ''}`}>
                     {text === "QIMENGAPP" ? '启蒙App' : text}
                 </span>
             )
         }, {
             title: '执行人',
             width: 200,
             dataIndex: 'recipient',
             render: (text, record) => <span className={`${record.readStatus === 0 ? 'cDefault' : ''}`}>{text}</span>
         }, {
             title: '操作',
             dataIndex: 'operate',
             width: 120,
             render: (text, record) => <ShowSystemDetailButton item={record} emitRead={this.readMessage}/>
         },
     ];
     componentDidMount(){
         this.queryList();
     };

     /**
      * 获取数据
      */
     queryList = () => {
         const {pageSize, pageNo, noticeTheme, babyName, startTime, endTime, readStatus} = this.state;
         const param = {
             pageSize, pageNo, readStatus,
             noticeTheme, babyName, startTime, endTime,
             currentCenterId: User.currentCenterId
         };
         getMessageList(param).then((res:any) => {
             this.setState({
                 dataSource: res.list,
                 totalSize: res.totalSize,
             })
         })
     };
     /**
      * 分页搜索
      */
     handleChangePage = (pageInfo) => {
         this.setState({
             pageNo: pageInfo.pageNo,
             pageSize: pageInfo.pageSize,
         }, this.queryList);
     };
     /**
      * 条件搜索
      * @param values
      */
     onSearch = (values:any) => {
         this.setState({
             ...values,
             startTime: values.date[0].valueOf(),
             endTime: values.date[1].valueOf(),

             pageNo:1
         }, this.queryList)
     };
     /**
      *
      * @param {string} id
      */
     readMessage = () => {
         this.queryList();
     };
     render(){
         const {totalSize, dataSource, pageNo, pageSize } = this.state;
         return(
             <Fragment>
                 <BreadCrumb routes={this.breadCrumbRoutes}/>
                 <div className='text-r'>
                     <p>本页面只支持查询从当前时间开始往前推2个月的数据。</p>
                 </div>
                 <div className='page-wrap'>
                     <SearchForm items={this.searchConfig()} onSearch={this.onSearch}/>
                     <TablePagination
                         columns={this.columns}
                         dataSource={dataSource}
                         totalSize={totalSize}
                         pageNo={pageNo}
                         pageSize={pageSize}
                         rowKey='mainId'
                         handleChangePage={this.handleChangePage}
                     />
                 </div>
             </Fragment>
         )
     }
 }

 export {MessageCenter}
