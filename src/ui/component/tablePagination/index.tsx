/**
 * desc: 表格(带分页面)
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/16
 * Time: 上午9:49
 */

import React from 'react';
import {Pagination} from "../pagination";
import {Table as AntDTable} from 'antd';
import {DefaultDataContent} from "../defaultDataContent/defaultDataContent";

import './index.scss';

interface tableProps {
    [propsName:string]:any,
}
class Table extends React.Component<tableProps, any>{
    render(){
        let {dataSource,className,handleChangePage,...rest}=this.props;
        dataSource=dataSource instanceof Array? dataSource : [];
        return (<AntDTable
                locale={{emptyText:<DefaultDataContent/>}}
                className={`gym-table-component
                ${((dataSource.length<1 )&& (typeof handleChangePage==='undefined'))? 'gym-table-component-no-data' : ''}
                ${className? className : ''}`}
                bordered={false}
                pagination={false}
                dataSource={dataSource}
                scroll={{x : 'max-content'}}
                {...rest}
            />
        )
    }
}

declare interface TablePaginationProps {
    totalSize?:number,
    pageNo?:number,
    pageSize?: number,
    handleChangePage?:(pageInfo:any) => void,
    className?:string,
    columns:Array<any>,
    dataSource:Array<any>,
    [propsName:string]:any,
    pageSizeOptions?:string[]
}

// 带分页Table
class TablePagination extends React.Component<TablePaginationProps,any>{
  // 触发切换分页事件
  handleChangePageInside = ({pageNo,pageSize})=>{
    this.setState({pageNo,pageSize},()=>{
      this.props.handleChangePage({pageNo,pageSize})
    })
  };

  render(){
    const {totalSize, pageNo, pageSize, className, pageSizeOptions} = this.props;
    return(
      <div className={`gym-table-wrap ${className? className : ''}`}>
        <Table
            {...this.props}
            onChange={this.props.handleFilterTableChange}
        />
        <Pagination
            total={totalSize}
            defaultCurrent={pageNo}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions?pageSizeOptions:['10', '20', '50', '100']}
            onChange={this.handleChangePageInside}
        />
      </div>
    )
  }
}

export {TablePagination, Table};
