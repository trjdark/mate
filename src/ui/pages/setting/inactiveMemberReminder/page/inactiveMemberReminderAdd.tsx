import React from "react";
import { Routes } from "@/router/enum/routes";
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { SearchForm } from "../../../../component/searchForm";
import { PageTitle } from "@/ui/component/pageTitle";
import {
    getNonBlackList,
    addBlackList
} from "@redux-actions/setting/blackListActions";
import { Message } from "@/ui/component/message/message";
import { User } from "../../../../../common/beans/user";
import { TablePagination } from "../../../../component/tablePagination";
import { connect } from "@/common/decorator/connect";
import { selectTotalEmployeeList } from "@/saga/selectors/home";
import moment from "antd/node_modules/moment";
import {FUNC} from "@/ui/pages/setting/enum/functions";


const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])

const gaOption = isPostTransRole ? {
    leaveDate: moment().add(-0.5, "y").valueOf(),
    roleList: ["GA", "HGA"]
}:{
    leaveDate: moment().add(-0.5, "y").valueOf(),
    postName: ["GA", "HGA"]
};

const gbOption = isPostTransRole ? {
    leaveDate: moment().add(-0.5, "y").valueOf(),
    roleList: ["GB", "HGB"]
}:{
    leaveDate: moment().add(-0.5, "y").valueOf(),
    postName: ["GB", "HGB"]
};

@connect(state => ({
    gbList: selectTotalEmployeeList(state, gbOption),
    gaList: selectTotalEmployeeList(state, gaOption)
}))
class InactiveMemberReminderAdd extends React.Component<any, any> {
    private breadCrumbRoutes: Array<any> = [
        { name: "设置", path: "", link: "#", id: "" },
        { name: "运营管理", path: "", link: "#", id: "" },
        { name: "非活跃会员不提醒设置", path: "", link: "# " }
    ];
    constructor(props: any) {
        super(props);
        this.state = {
            currentCenterId: User.currentCenterId,
            pageNo: 1,
            pageSize: 10,
            totalNo: 1,
            totalSize: 10,
            dataSource: [],
            selectedRowKeys: [],
            gaStaffId: "",
            gbStaffId: ""
        };
    }

    componentDidMount() {
        this.getData();
    }

    /**
     * 搜索
     * @param json
     */
    onSearch = (values: any) => {
        this.setState(
            {
                ...values,
                pageNo: 1
            },
            this.getData
        );
    };
    /**
     * 分页
     * @param page
     */
    handleChangePage = (pageInfo: any) => {
        this.setState(pageInfo, this.getData);
    };
    /**
     * 获取数据
     */
    getData = () => {
        const {
            pageNo,
            pageSize,
            currentCenterId,
            totalNo,
            totalSize,
            babyName,
            tel,
            gaStaffId,
            gbStaffId
        } = this.state;
        getNonBlackList({
            pageNo,
            pageSize,
            currentCenterId,
            babyName,
            tel,
            totalNo,
            totalSize,
            gaStaffId,
            gbStaffId
        }).then((res: any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            });
        });
    };
    /**
     * 选择框
     */
    selectRow = record => {
        const selectedRowKeys = [...this.state.selectedRowKeys];
        if (selectedRowKeys.indexOf(record.key) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
        } else {
            selectedRowKeys.push(record.key);
        }
        this.setState({ selectedRowKeys });
    };
    /**
     * 选择条件改变
     */
    onSelectedRowKeysChange = selectedRowKeys => {
        this.setState({
            selectedRowKeys: selectedRowKeys
        });
    };
    /**
     * 提交新增黑名单
     */
    handleAddBlackList = () => {
        const { selectedRowKeys } = this.state;
        if (selectedRowKeys.length === 0) {
            Message.error("至少需要选择一条数据！");
            return;
        }
        const param = {
            leadsIds: selectedRowKeys,
            currentCenterId: User.currentCenterId
        };
        addBlackList(param)
            .then(() => {
                this.onSearch({ pageNo: this.state.pageNo });
            })
            .then(() => {
                Message.success("添加成功！");
            });
        this.setState({
            selectedRowKeys: []
        });
    };
    /**
     * 取消提交
     */
    handleCancel = () => {
        this.props.history.push(`${Routes.非活跃会员提醒设置.path}`);
    };

    // 搜索配置
    searchConfig = (): Array<any> => {
        const { gaList, gbList } = this.props;
        const gaOption = gaList.map((item: any) => ({
            postCode: item.staffId,
            postName: item.userName
        }));
        const gbOption = gbList.map((item: any) => ({
            postCode: item.staffId,
            postName: item.userName
        }));
        return [
            {
                label: "手机号码",
                required: false,
                type: "text",
                placeholder: "手机号",
                name: "tel"
            },
            {
                label: "宝宝姓名",
                required: false,
                type: "text",
                placeholder: "宝宝姓名",
                name: "babyName"
            },
            {
                label: "GA",
                required: false,
                type: "select",
                placeholder: "请选择GA",
                name: "gaStaffId",
                options: gaOption
            },
            {
                label: "GB",
                required: false,
                type: "select",
                placeholder: "请选择GB",
                name: "gbStaffId",
                options: gbOption
            }
        ];
    };
    // 表头配置
    columns = [
        {
            title: "宝宝姓名",
            dataIndex: "babyName",
            width: 200
        },
        {
            title: "手机",
            dataIndex: "contactTel",
            width: 100
        },
        {
            title: "昵称",
            dataIndex: "nickName",
            width: 100
        },
        {
            title: "GA",
            dataIndex: "gaStaffName",
            width: 100
        },
        {
            title: "GB",
            dataIndex: "gbStaffName",
            width: 100
        }
    ];
    render() {
        const {
            pageNo,
            pageSize,
            dataSource,
            totalSize,
            selectedRowKeys
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedRowKeysChange
        };
        return (
            <div id={`gym-inactivemember-add`}>
                <BreadCrumb routes={this.breadCrumbRoutes} />
                <div className="page-wrap">
                    <PageTitle
                        className='gym-inactivemember-tip'
                        title={`请选择宝宝`}
                    />
                    <SearchForm
                        items={this.searchConfig()}
                        onSearch={this.onSearch}
                    />
                    <TablePagination
                        rowSelection={rowSelection}
                        onRow={record => ({
                            onClick: () => {
                                this.selectRow(record);
                            }
                        })}
                        columns={this.columns}
                        rowKey={"leadsId"}
                        dataSource={dataSource}
                        totalSize={totalSize}
                        pageSize={pageSize}
                        handleChangePage={this.handleChangePage}
                        pageNo={pageNo}
                    />
                    <div className='gym-inactivemember-add-handle'>
                        <button
                            className='gym-button-xs gym-button-default mt15'
                            onClick={this.handleAddBlackList}
                        >
                            确定
                        </button>
                        <button
                            className='gym-button-xs gym-button-white mt15 ml30'
                            onClick={this.handleCancel}
                        >
                            取消
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export { InactiveMemberReminderAdd };
