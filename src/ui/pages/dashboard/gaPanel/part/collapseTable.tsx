import React, {Component, Fragment, ReactDOM} from 'react';
import {PageTitle} from "@/ui/component/pageTitle";
import {TablePagination} from "@/ui/component/tablePagination";
import {Collapse, Icon} from 'antd';
const { Panel } = Collapse;

declare interface CollapseTableProps {
    totalSize?:number,                          // 数据总条数
    pageNo?:number,                             // 页数
    pageSize?: number,                          // 每页数据条数
    handleChangePage?:(pageInfo:any) => void,   // 分页触发的函数
    className?:string,                          // 类名
    columns:Array<any>,                         // 表头
    dataSource?:Array<any>,                     // 数据
    [propsName:string]:any,
    pageSizeOptions?:string[],
    title?:string,                              // 表格标题
    remark?:string,                             // 提示框文字
}

declare interface HeadComponentProps {
    open:boolean,
    remark?:string,                             // 提示框文字
    title:string | ReactDOM,
    handleRefresh?:() => void,   // 刷新触发的函数
}

// 头部组件
class HeadComponent extends Component<HeadComponentProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            iconRefresh: false   // 控制刷新的icon动画
        }
    }
    // 点击控制刷新的icon动画
    onChange = () => {
        this.setState({iconRefresh: !this.state.iconRefresh})
    }
    refresh = (e) => {
        e.stopPropagation()
        this.onChange()
        this.props.handleRefresh()
    }
    render() {
        const {title, remark, open} = this.props
        const {iconRefresh} = this.state

        return (
            <Fragment>
                <PageTitle title={title} remark={remark}/>
                <div className="gym-dashboard-collapse-table-panel-right">

                    <Icon className={`gym-dashboard-collapse-table-panel-right-icon ${iconRefresh?'open': 'close'}`} type="sync" onClick={this.refresh} />
                    <span >{open?'收起':'展开'}</span>
                </div>
            </Fragment>
        )
    }
}

export class CollapseTable extends Component<CollapseTableProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            open: false, // 控制展开收起按钮
        }
    }
    // 点击展开收起按钮事件
    onChange = () => {
        this.setState({open: !this.state.open})
    }
    // icon刷新函数
    handleRefreshInside = ()=>{
        this.setState({pageNo:1,pageSize:10},()=>{
            this.props.handleChangePage({pageNo:1,pageSize:10})
        })
    };

    render() {
        const {title, remark, columns, rowKey, className, totalSize, pageSize, pageNo, dataSource, handleChangePage } = this.props;
        const { open } = this.state;
        return (
            <Collapse
                bordered={false}
                className={`gym-dashboard-collapse-table ${className?className:''}`}
                onChange={this.onChange}
            >
                <Panel
                    header={<HeadComponent title={title} open={open} remark={remark} handleRefresh={this.handleRefreshInside}/>}
                    key="1"
                    className="gym-dashboard-collapse-table-panel"
                >
                    <TablePagination
                        columns={columns}
                        rowKey={rowKey}
                        dataSource={dataSource}
                        totalSize={totalSize}
                        pageSize={pageSize}
                        handleChangePage={handleChangePage}
                        pageNo={pageNo}
                    />
                </Panel>
            </Collapse>
        );
    }
}
