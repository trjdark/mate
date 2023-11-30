import React from 'react';
import {TablePagination} from '@/ui/component/tablePagination';
import {getFinancialRecordInfo} from "@redux-actions/customer/hokaniInfo";
import {User} from "@/common/beans/user";
import * as moment from 'moment';
const Fragment=React.Fragment;

class RecordList extends React.Component<any,any>{
  constructor(props){
    super(props)
    this.state={
      columns:[
        {title:'收支类型',dataIndex:'financialType',key:'financialType'},
        {title:'原因',dataIndex:'financialContentValue',key:'financialContentValue'},
        {title:'金额',dataIndex:'amount',key:'amount', render: (num:number) => num.toFixed(2)},
        {title:'方式',dataIndex:'financialMode',key:'financialMode'},
        {title:'经办人',dataIndex:'operationStaffName',key:'operationStaffName'},
        {
          title:'日期',
          dataIndex:'financialDate',
          key:'financialDate',
          render:(text)=>(text? moment(text).format('YYYY-MM-DD') : '')
        },
      ],
      dataSource:[],
      pager:{
        totalSize:10,
        pageNo:1,
        pageSize:10
      }
    }
  }

  handleChangePage = ({pageNo,pageSize})=>{
    getFinancialRecordInfo({
      currentCenterId:User.currentCenterId,
      leadsId:this.props.leadsId,
      pageNo,
      pageSize
    }).then(res=>{
      this.setState({
        dataSource:res.list,
        pager:{
          totalSize:res.totalSize,
          pageNo:res.pageNo,
          pageSize:res.pageSize
        }
      })
    })
  }

  componentDidMount () {
    getFinancialRecordInfo({
      currentCenterId:User.currentCenterId,
      leadsId:this.props.leadsId,
      pageNo:this.state.pager.pageNo,
      pageSize:this.state.pager.pageSize
    }).then(res=>{
      this.setState({
        dataSource:res.list,
        pager:{
          totalSize:res.totalSize,
          pageNo:res.pageNo,
          pageSize:res.pageSize
        }
      })
    })
  }

  render(){
    const {
      columns,
      dataSource,
      pager
    }=this.state;

    return (
      <Fragment>
        <div className="record-list">
          <TablePagination dataSource={dataSource}
                           columns={columns}
                           totalSize={pager.totalSize}
                           pageNo={pager.pageNo}
                           pageSize={pager.pageSize}
                           handleChangePage={this.handleChangePage}
                           rowKey="financialId"
          />
        </div>
      </Fragment>
    )
  }
}

export {RecordList}
