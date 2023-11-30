/**
 * desc: 中心业绩报表查询结果
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/1/10
 * Time: 上午10:38
 */
import React, {Component, Fragment} from 'react';
import {Table} from "@/ui/component/tablePagination";
import {countRowSpan, getDerivedStateFromProps} from "../../common";

class SearchResult extends Component<any, any> {
    static getDerivedStateFromProps(nextProps, prevState) {
        return getDerivedStateFromProps(nextProps, prevState);
    }

    constructor(props) {
        super(props);
        this.state = {
            baseColumns: [
                {
                    title: '城市',
                    dataIndex: 'cityName',
                    width: 110,
                    fixed: 'left',
                    render: (text, row, index) => {
                        // 计算合并后的单元格
                        const {cityRange} = this.state;
                        return countRowSpan(cityRange, text, index);
                    }
                },
                {
                    title: '中心',
                    dataIndex: 'centerName',
                    width: 110,
                    fixed: 'left',
                    render: (text, row, index) => {
                        // 计算合并后的单元格
                        const {centerRange} = this.state;
                        return countRowSpan(centerRange, text, index);
                    }
                },
                {
                    title: '时间数据',
                    dataIndex: 'typeName',
                    width: 100,
                    colSpan: 2,
                    fixed: 'left',
                    render: (text, row, index) => {
                        // 计算合并后的单元格
                        const {typeRange} = this.state;
                        return countRowSpan(typeRange, text, index);
                    }
                },
                {
                    title: '',
                    dataIndex: 'periodName',
                    colSpan: 0,
                    width: 100,
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

export default SearchResult;
