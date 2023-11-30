/**
 * desc: 封装分页组件
 * Date: 2018/8/6
 * Time: 下午7:45
 */
import React from 'react';
import {Pagination as AntdPagination} from 'antd';
import './index.scss';

declare interface PaginationProps {
    total:number,
    defaultCurrent:number,
    pageSize:number,
    onChange:(pageInfo:object) => void,
    className?:string,
    pageSizeOptions?:string[]
}

class Pagination extends React.Component<PaginationProps, any>{
    private DEFAULT_PAGESIZE:number = 10;
    state = {
        currentPage: this.props.defaultCurrent || 1,
        pageSize: this.props.pageSize || 10,
    };
    handleChange = (pageNumber:number, pageSize:number) => {
        this.setState({currentPage:pageNumber, pageSize:pageSize});
        this.props.onChange({pageNo:pageNumber, pageSize:pageSize});
    };
    render(){
        const {total, defaultCurrent, pageSize, pageSizeOptions} = this.props;
        const pageCount=Math.ceil(total/(pageSize || this.DEFAULT_PAGESIZE) );
        return(
            <div className={`gym-page-content gym-clearfix ${this.props.className}`}>
                {
                    total > 0 &&
                    <div>
                        <div className='fl'>
                            <span>共{total}条记录</span>
                            <span>第{defaultCurrent||1}/{pageCount}页</span>
                        </div>
                        <AntdPagination
                            size="small"
                            className='gym-float-right'
                            showSizeChanger = {true}
                            showQuickJumper = {pageCount > 1 ? true : false}
                            pageSizeOptions= {pageSizeOptions?pageSizeOptions:['10', '20', '50', '100']}
                            onShowSizeChange={this.handleChange}
                            current={defaultCurrent || 1}
                            total={total}
                            onChange={this.handleChange}
                            pageSize={pageSize || this.DEFAULT_PAGESIZE}
                        />
                    </div>
                }
            </div>
        )
    }
}

export {Pagination}
