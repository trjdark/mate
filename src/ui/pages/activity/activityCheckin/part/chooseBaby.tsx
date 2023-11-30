/**
 * desc: 签到页面的选择宝宝组件
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/12/7
 * Time: 下午1:38
 */
import React, {Component} from 'react';
import {Form} from "antd";
import {TablePagination} from "@/ui/component/tablePagination";
import {SearchForm} from "@/ui/component/searchForm";
import {connect} from "react-redux";
import {getGA, getGB} from "@redux-actions/customer/taskCenter";
import {setSelectedBaby, setSelectedCourse} from "@/saga/actions/activity/activityDetail";
import {Fetch} from "@/service/fetch";
import {User} from "@/common/beans/user";
import {ActivityApi} from "@/api/activityApi";

class ChooseBaby extends Component<any, any> {
    static getDerivedStateFromProps(nextProps, prevState) {
        const {GBlist, GAlist} = nextProps;
        let {gblist = [], galist = []} = prevState;
        if (JSON.stringify(GBlist) !== JSON.stringify(gblist) || JSON.stringify(GAlist) !== JSON.stringify(galist)) {
            // 如果属性发生了改变，更新state对应的值,转换成需要的格式
            let gagbList = [...GBlist, ...GAlist].map(item => {
                const {staffId, userName} = item;
                return {
                    postCode: staffId,
                    postName: userName,
                }
            });
            return {
                gblist: GBlist,
                galist: GAlist,
                gagbList,
            }
        }
        return null
    }

    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '宝宝姓名',
                    dataIndex: 'babyName'
                },
                {
                    title: '课程包名称',
                    dataIndex: 'packageName'
                },
                {
                    title: '联系人',
                    dataIndex: 'contactName'
                },
                {
                    title: 'GB',
                    dataIndex: 'gbName'
                },
                {
                    title: 'GA',
                    dataIndex: 'gaName'
                },
            ],
            dataSource: [],
            babyListItem: [
                {
                    type: 'select',
                    label: 'GA/GB',
                    name: 'gagbId',
                    options: [],
                },
                {
                    type: 'text',
                    label: '宝宝姓名',
                    name: 'babyContactName',
                    placeholder: '请输入宝宝姓名/昵称/联系人',
                },
            ],
            gagbList: [],   //
            pageNo: 1,      // 当前页码
            pageSize: 10,   // 请求条数
            totalSize: 0,    // 总记录数
            gagbId: undefined,           // 查询条件，gagbId
            babyContactName: undefined, // 查询条件，宝宝名称
            currentCenterId: User.currentCenterId
        };
        this.onSearch = this.onSearch.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.conditionSearch = this.conditionSearch.bind(this);
    }

    render() {
        const {columns, dataSource, babyListItem, pageNo, pageSize, totalSize, gagbList,} = this.state;
        const {selectedBaby, activityPayModeObj, payMode} = this.props;
        babyListItem[0].options = gagbList;
        return (
            <div className="choose-baby-wrap">
                <SearchForm
                    items={babyListItem}
                    onSearch={this.conditionSearch}
                    onReset={this.onReset}
                    className="mb15"
                />
                <p className="paymode">付费方式：{activityPayModeObj[payMode]}</p>
                <TablePagination
                    columns={columns}
                    rowKey={item => item.babyId}
                    dataSource={dataSource}
                    totalSize={totalSize}
                    pageSize={pageSize}
                    handleChangePage={this.handleChangePage}
                    pageNo={pageNo}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: selectedBaby.map(item => item.babyId),
                        onChange: this.handleCheckChange
                    }}
                />
            </div>
        )
    }

    componentDidMount() {
        // 页面加载时先加载一次ga和gb, 请求宝宝列表
        const {currentCenterId} = this.state;
        const {getGAlist, getGBlist} = this.props;
        getGAlist({currentCenterId});
        getGBlist({currentCenterId});
        this.onSearch();
    }

    // 处理分页
    handleChangePage({pageNo, pageSize}) {
        this.setState(
            {
                pageNo,
                pageSize
            },
            () => {
                this.onSearch();
            });
    };

    // 条件查询
    conditionSearch(values) {
        this.setState(
            {
                pageNo: 1,
                ...values
            },
            () => {
                this.onSearch();
            }
        );
    }

    /*查询宝宝列表*/
    onSearch() {
        const {pageNo, pageSize, currentCenterId, babyContactName, gagbId} = this.state;
        const params = {
            url: ActivityApi.获取会员宝宝列表,
            data: {
                currentCenterId,
                teachingActivityId: this.props.id,
                isFilterNotContract: true,
                babyContactName,
                gagbId,
                pageNo,
                pageSize,
            }
        };
        Fetch.post(params).then(res => {
            const {list, totalNo, totalSize} = res;
            if (Array.isArray(list) && list.length > 0) {
                let dataSource = list.map(item => {
                    const {
                        babyId, babyName, contactName, gbChineseName, packageName,
                        gbEnglishName, gaChineseName, gaEnglishName, leadsId
                    } = item;
                    return {
                        babyId,
                        babyName,
                        contactName,
                        packageName,
                        leadsId,
                        gbName: `${gbEnglishName || ''} ${gbChineseName || ''}`,
                        gaName: `${gaEnglishName || ''} ${gaChineseName || ''}`,
                    }
                });
                this.setState({
                    totalNo,
                    totalSize,
                    dataSource
                });

                // 默认选择第一项
                if (this.props.selectedBaby.length === 0) {
                    const selected = dataSource.slice(0, 1);
                    this.props.setSelectedBaby(selected);
                }
            } else {
                // 没有数据，宝宝列表置空
                this.setState({
                    dataSource: [],
                    totalNo,
                    totalSize,
                },()=>this.handleCheckChange([],[]))
            }
        })
    };

    /*
    * 重置搜索表单
    * @params values, 表单的所有值
    */
    onReset = (values) => {
        this.setState({
            ...values
        });
    };

    handleCheckChange(selectedRowKeys: string[], selectedRows: any[]) {
        // 选择宝宝时，把数据设置到redux
        this.props.setSelectedBaby(selectedRows);
        // 每次选择宝宝，就把之前选择的课程包清除
        this.props.setSelectedCourse({});
    };
}

const mapStateToProps = state => {
    const {
        GAlist, // GA列表
        GBlist, // GB列表
    } = state.taskList;
    const {
        types,
        id,
        selectedBaby, // 选中的宝宝
        payMode,        // 付费方式
    } = state.activityDetail;
    const {
        activityPayModeObj,    // 活动付费方式枚举
    } = types;
    return {
        GAlist,
        GBlist,
        id,
        selectedBaby,
        payMode,
        activityPayModeObj,
    }
};

const mapDispatchToProps = dispatch => ({
    getGAlist(params) {
        // 获取ga列表
        dispatch(getGA(params));
    },
    getGBlist(params) {
        // 获取gb列表
        dispatch(getGB(params))
    },
    setSelectedBaby(params) {
        dispatch(setSelectedBaby(params));
    },
    setSelectedCourse(data) {
        dispatch(setSelectedCourse(data));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ChooseBaby));
