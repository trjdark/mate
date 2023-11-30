/**
 * desc: 渠道出现方式业绩报表查询结果
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/2/15
 * Time: 上午10:38
 */
import React, {Component, Fragment} from 'react';
import {Table} from "@/ui/component/tablePagination";
import {countRowSpan, getDerivedStateFromProps} from "../common";
import {Tooltip} from "@/ui/component/toolTip";

class MarketSellSearchResult extends Component<any, any> {
    static getDerivedStateFromProps(nextProps, prevState) {
        const newState = getDerivedStateFromProps(nextProps, prevState);
        if (newState && newState.hasOwnProperty('columns')) {
            // 如果newState的值不是null，并且含有columns字段，需要计算渠道备注选项
            const {columns} = newState;
            const {remarkColumns} = prevState;
            if (nextProps.showChannelComment) {
                if (columns[1].title !== remarkColumns.title) {
                    columns.splice(1, 0, remarkColumns);
                    newState.scrollX = newState.scrollX + remarkColumns.width;  // 重新计算滚动条宽度
                }
            } else {
                columns.forEach((item, index, arr) => {
                    if (item.title === remarkColumns.title) {
                        arr.splice(index, 1);
                        newState.scrollX = newState.scrollX - remarkColumns.width;  // 重新计算滚动条宽度
                    }
                });
            }
        }
        return newState;
    }

    constructor(props) {
        super(props);
        this.state = {
            remarkColumns: {
                title: '渠道备注',
                dataIndex: 'channelRemark',
                width: 180,
                fixed: 'left',
                render: (text, row, index) => {
                    // 计算合并后的单元格
                    const {channelTypeRange} = this.state;
                    const tdContent = countRowSpan(channelTypeRange, text, index);
                    text = (text || '').trim();     // 有时从后台传回的可能是undefined
                    if (text.length > 10) {
                        tdContent.children = (
                            <Tooltip
                                title={text}
                            >
                                {`${text.slice(0, 10)}...`}
                            </Tooltip>
                        );
                    }
                    return tdContent;
                }
            },
            baseColumns: [
                {
                    title: '渠道来源',
                    dataIndex: 'channelName',
                    width: 110,
                    fixed: 'left',
                    render: (text, row, index) => {
                        // 计算合并后的单元格
                        const {channelTypeRange} = this.state;
                        return countRowSpan(channelTypeRange, text, index);
                    }
                },
                {
                    title: '时间数据',
                    dataIndex: 'typeName',
                    width: 110,
                    fixed: 'left',
                    render: (text, row, index) => {
                        // 计算合并后的单元格
                        const {typeRange} = this.state;
                        return countRowSpan(typeRange, text, index);
                    }
                },
                {
                    title: '出现方式',
                    dataIndex: 'callTypeName',
                    width: 120,
                    fixed: 'left',
                },
            ],     // 必须存在的表头字段
            columns: [],            // 表头字段,
            scrollX: 0,             // 表格横向滚动的距离
        };
    }

    shouldComponentUpdate(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean {
        // 传入的表格数据如果跟当前表格数据或者表头没有变化，不要重新传染组件
        if (JSON.stringify(nextProps.dataSource) !== JSON.stringify(this.props.dataSource)) {
            return true;
        }
        if (JSON.stringify(nextState.columns) !== JSON.stringify(this.state.columns)) {
            return true;
        }
        return false;
    }

    render() {
        const {columns, scrollX} = this.state;
        const {dataSource} = this.props;
        return (
            <Fragment>
                <div className="gym-report-result-content">
                    <Table
                        rowClassName={() => 'no-hover-background'}
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{x: scrollX, y: dataSource.length > 12 ? 600 : null}}
                        bordered={true}
                        pagination={false}
                        rowKey={item => item.id}
                    />
                </div>
            </Fragment>
        )
    }
}

export default MarketSellSearchResult;
