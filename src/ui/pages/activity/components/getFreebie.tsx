/**
 * desc: 选择赠品组件
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/12/7
 * Time: 下午1:38
 */
import React, {Component} from 'react';
import {InputNumber, Modal} from "antd";
import {User} from "@/common/beans/user";
import {setActivityData} from "@/saga/actions/activity/activityDetail";
import {getFreebie} from "@redux-actions/activity/activityDetail";
import {connect} from "react-redux";
import {cloneDeep, unionBy, differenceBy} from 'lodash';
import {PageTitle} from "@/ui/component/pageTitle";
import {TablePagination} from "@/ui/component/tablePagination";

const ACTUALFREEGIFTLIST = 'ACTUALFREEGIFTLIST';    // 更改实际赠品列表
const FREEGIFTLIST = 'FREEGIFTLIST';    // 更改规划的赠品列表

class GetFreebie extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '赠品名称',
                    dataIndex: 'freeGiftName'
                },
                {
                    title: '成本价',
                    dataIndex: 'costPrice'
                },
                {
                    title: '零售价',
                    dataIndex: 'retailPrice'
                },
                {
                    title: '数量',
                    dataIndex: 'num',
                    render: (text, item, index) => {
                        return (
                            <InputNumber
                                min={1}
                                max={1000}
                                size="small"
                                value={item.freeGiftNum}
                                precision={0}
                                onChange={value => this.handleChangeNum(value, index)}
                            />
                        )
                    }
                }
            ],
            dataSource: [],         // 赠品数据
            selectedRows: [],       // 已选择的赠品数据
            selectedRowsIsSeted: false, // 标识selectedRows是否透过ajax请求数据的方式被赋值过，默认为false没有赋值
            pageNo: 1,
            pageSize: 10,
            totalSize: 0,
        };
        this.handleChangePage = this.handleChangePage.bind(this);
        this.getProductList = this.getProductList.bind(this);
    }

    render() {
        const {columns, dataSource, pageNo, pageSize, totalSize, selectedRows} = this.state;
        return (
            <Modal
                title={<PageTitle className="content-modal-title" title="选择赠品"/>}
                visible={true}
                width={800}
                centered={true}
                wrapClassName="content-modal-wrap"
                onCancel={this.handleCancel}
                footer={false}
            >
                <TablePagination
                    columns={columns}
                    dataSource={dataSource}
                    rowSelection={{
                        selectedRowKeys: selectedRows.map(item => item.id),
                        onSelect: this.handleSelect,
                        onSelectAll: this.handleSelectedAll
                    }}
                    rowKey={item => item.id}
                    totalSize={totalSize}
                    pageNo={pageNo}
                    pageSize={pageSize}
                    handleChangePage={this.handleChangePage}
                />
                <div className='text-c mt30 mb15'>
                    <button className='gym-button-xs gym-button-default mr20' onClick={this.handleOk}>确定</button>
                    <button className='gym-button-xs gym-button-white' onClick={this.handleCancel}>取消</button>
                </div>
            </Modal>
        )
    }

    componentDidMount() {
        this.getProductList();
    }

    /**
     * 当数值发生变化时，把赠品数据对应位置的freeGiftNum改成新的数值
     * 如果已经选择了赠品，把selectedRows里的对应数据也修改了
     * @param value 输入的数值
     * @param index 当前操作的索引
     */
    handleChangeNum = (value, index) => {
        let selectedRows = cloneDeep(this.state.selectedRows);
        let dataSource = cloneDeep(this.state.dataSource);
        dataSource[index].freeGiftNum = value;
        selectedRows = selectedRows.map(val => {
            if (val.id === dataSource[index].id) {
                val.freeGiftNum = value;
            }
            return val;
        });
        this.setState({
            dataSource,
            selectedRows
        });
    };

    /**
     * 处理分页
     * @params pageNo 页码
     * @params pageSize 每页条数
     */
    handleChangePage = ({pageNo, pageSize}) => {
        this.setState(
            {
                pageNo,
                pageSize
            },
            () => {
                this.getProductList();
            });
    };

    /**
     * 用户选择某一条赠品
     * @params record 选中或取消选中
     * @params selected 选择的赠品
     */
    handleSelect = (record, selected) => {
        let selectedRowsArr = cloneDeep(this.state.selectedRows);
        if (selected) {
            // 如果用户执行的是选中操作，把该条添加到数组中
            selectedRowsArr.push(record)
        } else {
            // 如果用户执行的是取消操作，把该条从数组中删除
            for (let i = selectedRowsArr.length - 1; i >= 0; i--) {
                if (selectedRowsArr[i].id === record.id) {
                    selectedRowsArr.splice(i, 1);
                }
            }
        }

        // 把数据设置到state
        this.setState({
            selectedRows: selectedRowsArr,
        });
    };

    /**
     * 用户点击全选/全不选操作
     * @params record 选中或取消选中
     * @params selectedRows 选择的赠品
     * @params changeRows 发生变化的部分
     */
    handleSelectedAll = (selected, selectedRows, changeRows) => {
        let selectedRowsArr = cloneDeep(this.state.selectedRows);
        if (selected) {
            // 如果用户执行的是选中操作，把变化的数据添加到数组中
            selectedRowsArr = unionBy(selectedRowsArr, changeRows, 'id');
        } else {
            // 如果用户执行的是取消操作，把变化的数据从数组中删除
            selectedRowsArr = differenceBy(selectedRowsArr, changeRows, 'id');
        }

        // 把数据设置到state
        this.setState({
            selectedRows: selectedRowsArr,
        });
    };

    /*获取赠品列表*/
    getProductList() {
        // 获取赠品列表
        const params = {
            currentCenterId: User.user.currentCenterId,
            isEnabled: true,
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize
        };

        getFreebie(params).then(res => {
            const {estimateFreeGifts, freeListType, actualFreeGifts} = this.props;
            let {list, pageNo, pageSize, totalSize} = res;
            list.forEach(item => {
                // 给每条数据添加一个数量的字段
                item.freeGiftNum = 1;
            });
            list.forEach((item, index) => {
                // 用已选择的数据，覆盖掉部分原始数据
                if (freeListType) {
                    // 弹框类型为实际赠品时
                    actualFreeGifts.forEach(value => {
                        if (item.id === value.id) {
                            list[index] = value;
                        }
                    })
                } else {
                    // 弹框类型为规划赠品时
                    estimateFreeGifts.forEach(value => {
                        if (item.id === value.id) {
                            list[index] = value;
                        }
                    })
                }
            });

            let selectedRows = cloneDeep(this.state.selectedRows);      // 已选择的赠品
            // 如果state中的selectedRows还没有被赋值过，初始化赋值一次
            if (!this.state.selectedRowsIsSeted) {
                // 弹框类型为实际赠品时,初始化为实际赠品数据，反之设置为规划赠品数据
                selectedRows = freeListType ? actualFreeGifts : estimateFreeGifts;
            }

            this.setState({
                dataSource: list,
                selectedRows,
                totalSize,
                pageSize,
                pageNo,
                selectedRowsIsSeted: true
            });
        })
    }

    handleOk = () => {
        const {handleCloseFreebie, freeListType} = this.props;
        const {selectedRows} = this.state;
        handleCloseFreebie();
        // 根据弹框类型，把选择的数据设置到redux中不同的位置
        if (freeListType) {
            // 弹框类型为实际赠品时
            this.props.setActivityData(ACTUALFREEGIFTLIST, selectedRows);
        } else {
            // 弹框类型为规划赠品时
            this.props.setActivityData(FREEGIFTLIST, selectedRows);
        }
    };
    handleCancel = () => {
        this.props.handleCloseFreebie();
    }
}

const mapStateToProps = state => {
    const {
        estimateFreeGifts,   // 规划的赠品列表
        actualFreeGifts,     // 实际活动赠品
    } = state.activityDetail;
    return {
        estimateFreeGifts,
        actualFreeGifts,
    }
};

const mapDispatchToProps = dispatch => ({
    setActivityData(type, data) {
        dispatch(setActivityData(type, data));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(GetFreebie);
