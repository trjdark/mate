/**
 * desc: 活动耗课汇总
 * User: Dean
 * Date: 2020/9/11
 * Time: 16:38
 */
import React, {
  Component,
  Fragment
} from 'react';
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { SearchForm } from "@/ui/component/searchForm";
import { TablePagination } from "@/ui/component/tablePagination";
import FullScreen from '../components/fullScreen';
import moment from 'moment';
import { Routes } from "@/router/enum/routes";
import {
  getActiveCourse,
  getActiveCourseExports
} from "@redux-actions/report/messageReport";
import { User } from "@/common/beans/user";
import {
  Popover,
  message,
} from 'antd';
import { CommonUtils } from "@/common/utils/commonUtils";
import './style.scss'
import {activityType, activityPurpose} from './enum' // 枚举


class ActivityConsumptionCourseList extends Component<any,any> {
  private routes:Array<any> = [
    {
      name: '报表',
    },{
      name: '大服务类报表',
    },{
      name: '活动耗课统计/明细'
    }
  ]
  private searchConfig:Array<any> = [
    {
        type: 'rangePicker',
        label: '活动日期',
        name: 'startDate',
        placeholder: '时间段选择，按天',
        initialValue: [moment().startOf('month'), moment()]
    },
    {
      type: 'text',
      label: '活动名称',
      name: 'theme',
      placeholder: '请输入活动名称'
    }
  ]
    /**
     * 表格头配置
     * @type {({title: string; dataIndex: string; render: (text: any) => any} | {title: string; dataIndex: string; render: (text: any) => any} | {title: string; dataIndex: string; render: (date: any) => string} | {title: string; dataIndex: string} | {title: string; dataIndex: string; render: (text: any) => any} | {title: string; dataIndex: string; render: (text: string) => any} | {title: string; dataIndex: string; render: (text: string) => any} | {title: string; dataIndex: string; render: (text: string) => any} | {title: string; dataIndex: string; render: (text: string) => any} | {title: string; dataIndex: string; render: (text: any, record: any) => any})[]}
     */
  private columns:Array<object> = [
    {
      title:'活动类型',
      dataIndex: 'type',
      render:(text:any)=>(
        <span>
          {
            activityType[text * 1]
          }
          </span>
        )
    },
    {
      title:'活动目的',
      dataIndex: 'purpose',
      render:(text:any) => {
        return <span>
          {
            activityPurpose[text * 1]
          }
        </span>
      }
    },
    {
      title:'活动日期',
      dataIndex: 'startDate',
      render: (date:any) => (
        moment(date).format('YYYY-MM-DD')
      )
    },
    {
      title:'活动名称',
      dataIndex: 'theme'
    },
    {
      title:'应出席人数',
      dataIndex: 'shouldAttendNumber'
    },
    {
      title:'实际出席人数',
      dataIndex: 'actualAttendNumber'
    },
    {
      title:'出席率',
      dataIndex: 'activityAttendance',
      render:(text:any) => (
       <span> {text === 0 ? 0 : text + '%' } </span>
      )
    },
    {
      title:'INS',
      dataIndex: 'ins',
      render: (text:string) => this.cutstrHandler(text)
    },
    {
      title:'GB',
      dataIndex: 'gbs',
      render: (text:string) => this.cutstrHandler(text)
    },
    {
      title:'GA',
      dataIndex: 'gas',
      render: (text:string) => this.cutstrHandler(text)
    },
    {
      title:'MK',
      dataIndex: 'mks',
      render: (text:string) => this.cutstrHandler(text)
    },
    {
      title:'操作',
      dataIndex: 'operation',
      render: (text:any,record:any) => (
          <button className='gym-button-white gym-button-xxs' onClick={() => this.operationClickHandler(record)}>
              查看
          </button>
      )
    }
  ]
  // 气泡框结构
  /**
   * @params {any} textss
  */
  popContent = (text:any)=>(
    <div className="popContent">
      {
        text
      }
    </div>
  )
  constructor(props:any){
    super(props)
    this.state = {
      pageSize: 10,
      pageNo: 1,
      dataSource: [],
      totalNo:0,
      totalSize:0,
      canDownload:false,
      startDate:null, // 活动时间
      endDate:null, // 活动时间
      theme:null // 活动名称
    }
  }
  // 文字处理
  cutstrHandler(text:string){
    return (
      <Popover content={this.popContent(text)}>
        {CommonUtils.cutstr(text,8)}
      </Popover>
    )
  }
  // 搜索触发
  onSearch = (data:any) => {
    const startDate = data.startDate ? new Date(data.startDate[0]._d.toLocaleDateString()).getTime() : null
    const endDate = data.startDate ? new Date(data.startDate[1]._d.toLocaleDateString()).getTime() : null
    const theme = data.theme ? data.theme : null
    this.getActiveCourse(1,10,startDate,endDate,theme)
    this.setState({
      startDate: startDate,
      endDate: endDate,
      theme:theme
    })
  }
  // 跳转明细页面
  operationClickHandler = (record:any) => {
    record.activityId ? this.props.history.push(`${Routes.活动耗课明细表.link}${record.activityId}`) : null
  }
  // 数据获取
  /**
   * @currentCenterId {string} 中心id
   * @pageNo {number} 页码
   * @pageSize {number} 几条/页
   * @startDate ？ {string} 活动日期
   * @theme ？ {string} 活动名称
  */
  getActiveCourse(pageNo:any,pageSize:any,startDate?:any,endDate?:any,theme?:any){
    getActiveCourse({
      currentCenterId:User.currentCenterId,
      pageNo,
      pageSize,
      theme,
      startDate,
      endDate
    }).then(res => {
      this.setState({
        dataSource:res.list,
        totalNo:res.totalNo,
        totalSize:res.totalSize,
        pageNo: res.pageNo,
        pageSize: res.pageSize,
        canDownload: res.list.length >= 1 ? true : false
      })
    })
  }
  // 进入页面先渲染一次，默认数据是当月1号 到当前的数据
  componentDidMount(){
    const startDate = new Date(`${new Date().getFullYear()}-0${new Date().getMonth()+1}-01 00:00`).getTime()
    const endDate = new Date()
    this.setState({endDate,startDate})
  }
  // 报表导出
  handleDownLoadExcel(canDownload:boolean,totalSize:any,startDate?:any,endDate?:any,theme?:any){
    canDownload ? getActiveCourseExports({
      currentCenterId:User.currentCenterId,
      pageSize: totalSize,
      pageNo: 1,
      startDate,
      endDate,
      theme
    }) : message.error('没有内容可以导出')
  }
  render() {
    const {
      pageNo,
      pageSize,
      dataSource,
      totalNo,
      totalSize,
      theme,
      startDate,
      endDate,
      canDownload
    } = this.state;
  return (
      <Fragment>
        <BreadCrumb routes={this.routes}/>
        <div className="page-wrap">
          <SearchForm onSearch={this.onSearch} items={this.searchConfig} />
          <FullScreen handleDownLoadExcel={() => this.handleDownLoadExcel(canDownload,totalSize,startDate,endDate,theme)} canDownload={canDownload}>
          <TablePagination
          dataSource={dataSource}
          columns={this.columns}
          pageNo={pageNo}
          pageSize={pageSize}
          totalNo={totalNo}
          totalSize={totalSize}
          handleChangePage={
            (pageInfo)=>this.getActiveCourse(pageInfo.pageNo,pageInfo.pageSize,startDate,endDate,theme)
          }
          rowKey={(item:any)=> item.activityId}
          />
          </FullScreen>
        </div>
      </Fragment>
    );
  }
}

export {ActivityConsumptionCourseList};
