/**
 * desc: 权益金报表
 * User: Dean.yue
 * Date: 2021/1/6
 * Time: 上午10:38
 */
import React, { Component } from 'react';
import { BreadCrumb } from '@/ui/component/breadcrumb/index';
import { SearchForm } from './part/searchForm';
import { TablePagination } from '@/ui/component/tablePagination';
import moment from 'moment';
import { financialDetail, downloadFinancialDetail } from '@/redux-actions/report/financeReport'
import FullScreen from '../components/fullScreen';
import {User} from '@/common/beans/user'
import { searchSelectOptions } from './part/enum'
import { Routes } from '@/router/enum/routes'
import { CommonUtils } from '@/common/utils/commonUtils'
import { message } from 'antd'
class PaymentReceivedDetail extends Component <any,any>{
  constructor(props){
    super(props)
    this.state = {
      pageNo:1,
      pageSize:10,
      totalSize:null,
      totalNo:null,
      list:[],
      financialTime:moment(),
      financialType:null,
      canDownload:false
    }
  }
  breadCrumbRoutes = [
    {name:'报表'},{name:'财务类报表'},{name:'收付款明细'}
  ]
  columns = [
    {
      title:'中心号',
      dataIndex:'centerCode'
    },{
      title:'中心名称',
      dataIndex:'centerName'
    },{
      title:'合同号',
      dataIndex:'contractCode',
      render:(text:string,record:any)=>(
        <div style={{color:"#009cbd",cursor:"pointer"}} onClick={()=>{
          this.props.history.push(`${Routes.合同详情.link}${CommonUtils.stringify({contractCode:record.contractCode, contractId:record.contractId})}`)
        }}>
          {text}
        </div>
      )
    },{
      title:'收付款日期',
      dataIndex:'financialTime',
      render:(text:string)=>(
        text ?  moment(text).format('Y-M-DD') : text
      )
    },{
      title:'宝宝姓名',
      dataIndex:'babyName'
    },{
      title:'金额',
      dataIndex:'actualPrice'
    },{
      title:'费用类型',
      dataIndex:'financialType',
      render:(text) => {
        const filterText =  searchSelectOptions.filter(item => text === item.value)
        return filterText.length > 0 ? filterText[0].label : text
      }
    },{
      title:'业务类型	',
      dataIndex:'businessSource',
      render:(text) => {
        const filterText =  searchSelectOptions.filter(item => text === item.value)
        return filterText.length > 0 ? filterText[0].label : text
      }
    },{
      title:'Leads ID',
      dataIndex:'leadsId'
    },{
      title:'原合同收款日期',
      dataIndex:'contractTime',
      render:(text:string) => (
        text ?  moment(text).format('Y-M-DD') : text
      )
    }
  ]
  componentDidMount(){}
  /**
   * 获取list数据
   */
  financialDetail = () => {
    const { pageNo, pageSize, financialTime, financialType } = this.state
    const params = {
      currentCenterId:User.currentCenterId,
      financialTime:moment(financialTime).format('Y-MM'),
      financialType,
      pageNo,
      pageSize
    }
    financialDetail(params).then(res => {
      this.setState(
        {
          ...res,
          canDownload:res.list.length > 0
        }
      )
    })
  }
  /**
   * 点击分页
   * @param page
   */
  handleChangePage = (page:any) => {
    this.setState(page,this.financialDetail)
  }
  /**
   * 点击搜索
   * @param searchList
   */
  handleSearchClick = (searchList:any)=>{
    const { financialTime, financialType } = searchList
    this.setState({
      financialTime,
      financialType,
      pageNo:1,
      pageSize:10
    },this.financialDetail)
  }
  // 报表导出
  handleDownLoadExcel(){
    const { totalSize, financialTime,canDownload,financialType }  = this.state
    canDownload ? downloadFinancialDetail({
      currentCenterId:User.currentCenterId,
      pageSize: totalSize,
      pageNo: 1,
      financialTime:moment(financialTime).format('Y-MM'),
      financialType
    }) : message.error('没有内容可以导出')
  }
  render() {
    const { pageNo, pageSize, totalSize, totalNo, list, financialTime,canDownload }  = this.state
    return (
      <div>
        <BreadCrumb routes={this.breadCrumbRoutes}/>
        <div className='page-wrap'>
          <SearchForm
            time={financialTime}
            searchClick={this.handleSearchClick}
          />
          <FullScreen handleDownLoadExcel={()=>this.handleDownLoadExcel()} canDownload={canDownload}>

          <TablePagination
            columns={this.columns}
            dataSource={list}
            rowKey={'aparId'}
            pageNo={pageNo}
            pageSize={pageSize}
            totalSize={totalSize}
            totalNo={totalNo}
            handleChangePage={this.handleChangePage}
          />
          </FullScreen>
        </div>
      </div>
    );
  }
}

export  {PaymentReceivedDetail};
