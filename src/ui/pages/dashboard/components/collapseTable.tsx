/**
 * desc: 可折叠表格
 * User: katarina.yuan@gymboglobal.com
 * Date: 2021/8/18
 * Time: 上午9:50
 */

import React, {Component, Fragment, ReactDOM} from 'react';
import {PageTitle} from "@/ui/component/pageTitle";
import {TablePagination} from "@/ui/component/tablePagination";
import {Collapse, Icon} from 'antd';
const { Panel } = Collapse;


declare interface CollapseTableProps {
    handleChangePage?:(pageInfo:any) => void,   // 分页触发的函数
    className?:string,                          // 类名
    columns:Array<any>,                         // 表头
    [propsName:string]:any,
    pageSizeOptions?:string[],
    title?:string,                               // 表格标题
}

declare interface HeadComponentProps {
    open:boolean,
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
        this.setState({
                          iconRefresh: !this.state.iconRefresh
                      })
    }
    render() {
        const {title, open, handleRefresh} = this.props
        const {iconRefresh} = this.state
        const refresh = (e) => {
            e.stopPropagation()
            this.onChange()
            handleRefresh()
        }
        return (
            <Fragment>
                <PageTitle title={title} />
                <div className="gym-dashboard-collapse-table-panel-right">
                    <Icon className={`gym-dashboard-collapse-table-panel-right-icon ${iconRefresh?'open': 'close'}`} type="sync" onClick={refresh} />
                    <span>{open?'收起':'展开'}</span>
                </div>
            </Fragment>
        )
    }
}

class CollapseTable extends Component<CollapseTableProps, any> {
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
    handleRefreshInside = () => {
        const {pageSize} = this.props;
        const param = {pageNo:1, pageSize}
        this.props.handleChangePage(param)
    };

    render() {
        const { title, columns, rowKey, className, totalSize, pageSize, pageNo, dataSource, handleChangePage } = this.props;
        const { open } = this.state;
        return (
            <Collapse
                bordered={false}
                className={`gym-dashboard-collapse-table ${className?className:''}`}
                onChange={this.onChange}
            >
                <Panel
                    header={<HeadComponent title={title} open={open} handleRefresh={this.handleRefreshInside}/>}
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
export {CollapseTable}
