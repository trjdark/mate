/**
 * desc: 中心费率
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/8/29
 * Time: 下午3:44
 */
import React, {Component, Fragment} from 'react';
import {Upload, Spin, Alert} from 'antd';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import moment from 'moment';
import {connect} from "@/common/decorator/connect";
import {selectAllCenterList} from "@/saga/selectors/setting/employee";
import {TablePagination} from "@/ui/component/tablePagination";
import {
    queryCenterCostRate, exportCenterCostRate, updateCenterCostRate
} from "@redux-actions/centerCostRate";
import {User} from "@/common/beans/user";
import {InputNumber} from "@/ui/component/input";
import {Message} from "@/ui/component/message/message";
import {ContractApi} from "@/api/contractApi";
import './index.scss';

@connect((state) => ({
    centerList: selectAllCenterList(state)
}))

class CenterCostRate extends Component<any, any> {
    BREAD_CRUMB_ROUTES = [
        {name: '设置', id: 'setting'},
        {name: '财务管理', id: 'financialManagement'},
        {name: '中心费率设置', id: 'centerRate'},
    ];
    DEFAULT_TIME = moment();
    constructor(props){
        super(props);
        this.state = {
            pageNo: 1,
            pageSize: 10,
            beginYearMonth: this.DEFAULT_TIME.startOf('month').valueOf(),
            endYearMonth: this.DEFAULT_TIME.endOf('month').valueOf(),
            centerCodeList: [],
            editId:null,
            editInitRate: null,
            editDiscountRate: null,
            loading: false,
            msgList: []

        };
    }
    componentDidMount(){

    }
    /**
     * 获取数据
     */
    queryDate = () => {
        const {pageNo, pageSize, beginYearMonth, endYearMonth, centerCodeList} = this.state;
        const param = {
            pageNo, pageSize, beginYearMonth, endYearMonth, centerCodeList,
            currentCenterId:User.currentCenterId
        };
        queryCenterCostRate(param).then((res) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize,
            })
        })
    };
    /**
     * 搜索配置
     * @returns {Array<any>}
     */
    searchOptions = ():Array<any> => {
        const {centerList} = this.props;
        return [
            {
                label: '查询年月',
                type: 'months',
                name: {
                    start: 'beginYearMonth',
                    end: 'endYearMonth'
                },
                startInitialValue: this.DEFAULT_TIME,
                endInitialValue: this.DEFAULT_TIME,
            },
            {
                label: '中心选择',
                type: 'select',
                name: 'centerCodeList',
                multiple: true,
                options: centerList.map(item => ({postCode: item.centerCode, postName: `${item.centerCode}-${item.centerName}`}))
            }
        ]
    };
    columns = [
        {
            title: '月份',
            dataIndex: 'periodMonth'
        },{
            title: '中心号',
            dataIndex: 'centerCode'
        },{
            title: '中心名称',
            dataIndex: 'centerName'
        },{
            title: '初始费率（%）',
            dataIndex: 'initRate',
            render: (text:number, record:any) => {
                const id = record.id;
                return id === this.state.editId
                    ? <InputNumber
                        value={this.state.editInitRate}
                        precision={2}
                        onChange={(e) => this.handleChange(e, 'initRate')}
                    />
                    : text
            }
        },{
            title: '优惠后费率（%）',
            dataIndex: 'discountRate',
            render: (text:number, record:any) => {
                const id = record.id;
                return id === this.state.editId
                    ? <InputNumber
                        precision={2}
                        value={this.state.editDiscountRate}
                        onChange={(e) => this.handleChange(e, 'discountRate')}
                    />
                    : text
            }
        },{
            title: '最后更新时间',
            dataIndex: 'lastUpdateDate',
            render: (number) => number ? moment(number).format('YYYY-MM-DD HH:mm:ss') : null
        },{
            title: '最后更新人',
            dataIndex: 'lastUpdateBy',
        },{
            title: '编辑',
            dataIndex: 'action',
            render: (text, record) => {
                const id = record.id;
                return (
                    id !== this.state.editId
                    ? <button
                            className='gym-button-white gym-button-xxs'
                            onClick={() => this.handleEdit(record)}
                        >编辑</button>
                    : <button
                            className='gym-button-white gym-button-xxs'
                            onClick={() => this.handleSave()}
                        >保存</button>
                )
            }
        }
    ];
    /**
     * 编辑
     */
    handleEdit = (record:any) => {
        this.setState({
            editId: record.id,
            editInitRate: record.initRate,
            editDiscountRate: record.discountRate
        })
    };
    /**
     * 保存
     */
    handleSave = () => {
        const {editId, editInitRate, editDiscountRate} = this.state;
        const param = {
            id: editId,
            initRate: editInitRate,
            discountRate:editDiscountRate ,
            currentCenterId: User.currentCenterId
        };
        updateCenterCostRate(param).then(() => {
            this.queryDate();
            Message.success('修改成功', 3, () => {
                this.setState({
                    editId: null,
                    editInitRate: null,
                    editDiscountRate: null
                })
            });

        });
    };
    /**
     * 改变 初始费率、优惠后费率
     */
    handleChange = (value, name) => {
        switch (name) {
            case 'initRate':
                this.setState({editInitRate: value});
                break;
            case 'discountRate':
                this.setState({editDiscountRate: value});
                break;
        }
    };
    /**
     * 查询
     */
    onSearch = (values) => {
        const param = {
            beginYearMonth: moment(values.beginYearMonth).startOf('month').valueOf(),
            endYearMonth: moment(values.endYearMonth).endOf('month').valueOf(),
            centerCodeList: values.centerCodeList,
            pageNo:1
        };
        this.setState({...param}, this.queryDate);
    };
    /**
     * 导出
     */
    handleExport = () => {
        const {pageNo, pageSize, beginYearMonth, endYearMonth, centerCodeList} = this.state;
        const param = {pageNo, pageSize, beginYearMonth, endYearMonth, centerCodeList};
        exportCenterCostRate(param);
    };
    /**
     * 导入
     */
    handleUpload = (info) => {
        const file = info.file;
        switch (file.status){
            case 'uploading':
                this.setState({loading: true});
                break;
            case 'done':
                this.setState({loading: false});
                let msg = null, errList = [];
                if(file.response) {
                    if(file.response.code === 1){
                        msg = file.response.data.message;
                        errList = file.response.data.errorList;
                        this.setState({msgList: errList})
                        Message.success(msg);
                    }else{
                        Message.error(file.response.msg || '导入失败');
                    }
                }else{
                    Message.error('导入失败');
                }
                break;
            case 'error':
                this.setState({loading: false});
                break;
        }
    };
    /**
     * 分页
     * @param pageInfo
     */
    changePage = (pageInfo) => {
        this.setState(pageInfo, () => {
            this.queryDate();
        })
    };
    handleClose = () => {
        this.setState({msgList: []})
    }
    render(){
        const {dataSource, totalSize, pageNo, pageSize, loading, msgList} = this.state;
        return (
            <div id="gym-setting-center-cost-rate">
                <BreadCrumb routes={this.BREAD_CRUMB_ROUTES}/>
                <div className='page-wrap'>
                    <SearchForm
                        items={this.searchOptions()}
                        onSearch={this.onSearch}
                    />
                    <div className='mb25 flex'>
                        <Upload
                            name='file'
                            action={`/api/${ContractApi.中心费率导入}${User.currentCenterId}`}
                            headers= {
                                {
                                    authorization: 'authorization-text',
                                    token: User.getToken
                                }
                            }
                            onChange={this.handleUpload}
                            showUploadList={false}
                        >
                            <Spin spinning={loading}>
                                <button className='gym-button-xs gym-button-white mr15 ml30'>导入</button>
                            </Spin>
                        </Upload>
                        <button className='gym-button-xs gym-button-default' onClick={this.handleExport}>导出</button>
                    </div>
                    {
                        (msgList.length > 0) &&
                        <Alert
                            message={<Fragment>
                                {msgList.map((item, index) => <p key={index}>{item}</p>)}
                            </Fragment>}
                            type="warning"
                            className='mb25 gym-setting-center-cost-rate-alert'
                            closable
                            onClose={this.handleClose}
                        />
                    }
                    <TablePagination
                        dataSource={dataSource}
                        columns={this.columns}
                        totalSize={totalSize}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        handleChangePage={this.changePage}
                        rowKey='id'
                    />
                </div>
            </div>
        )
    }
}

export {CenterCostRate}


