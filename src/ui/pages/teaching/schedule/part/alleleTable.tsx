/**
 * Desc: 等位列表
 * User: dean.yue
 * Date: 2020/12/4,
 * Time: 下午4:11
 */
import React, { Component } from 'react';
import { TablePagination } from '@/ui/component/tablePagination'
import {
  getAlleleList
} from "@redux-actions/teaching/scheduleAction";
import { User } from '@/common/beans/user';

declare interface AlleleTableProps {
  lessonId:string,
  [propsName:string]:any
}
const alleleStatus = new Map([
  ['1504004','排队中'],
  ['1504005','排队失败'],
  ['1504006','排队取消']
])
class AlleleTable extends Component<AlleleTableProps,any> {
  constructor(props){
    super(props)
    this.state = {
      pageNo:1,
      pageSize:10,
      totalSize:Number,
      list:[]
    }
  }
  columns = [
    {
      title:'宝宝姓名',
      dataIndex:'babyName',
    },{
      title:'昵称',
      dataIndex:'babyNickName',
    },{
      title:'性别',
      dataIndex:'gender',
    },{
      title:'出生日期',
      dataIndex:'birthday',
    },{
      title:'排课类型',
      dataIndex:'bookType',
      render:()=> "W"
    },{
      title:'排课日期',
      dataIndex:'bookTime',
    },{
      title:'排课人',
      dataIndex:'bookStaff',
    },{
      title:'状态',
      dataIndex:'status',
      render:(text:any)=>(
        <span>{alleleStatus.get(text)}</span>
      )
    }
    
  ]
  componentDidMount(){
    this.getAlleleList()
  }

  getAlleleList = ()=>{
    const {pageNo, pageSize, totalSize} = this.state
    const { lessonId } = this.props
    getAlleleList({pageNo, pageSize, totalSize, lessonId, currentCenterId:User.currentCenterId}).then(res => {
      this.setState(res)
    })
  }
  /**
   * 分页切换
   * @param page 
   */
  handleChangePageInside =(page:any)=>{
    this.setState(page,this.getAlleleList)
  }
  render() {
    const {pageNo, pageSize, totalSize, list} = this.state
    return (
      <div>
        <TablePagination 
          columns={this.columns}
          dataSource={list}
          pageNo={pageNo}
          pageSize={pageSize}
          totalSize={totalSize}
          handleChangePage={this.handleChangePageInside}
          rowkey={'id'}
        />
      </div>
    );
  }
}

export  {AlleleTable};