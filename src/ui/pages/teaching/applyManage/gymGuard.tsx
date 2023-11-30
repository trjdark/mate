/**
 * desc: gym guard列表
 * User: colin.lu
 * Date: 2018/12/28
 * Time: 上午10:00
 */

import React from 'react';
import {Link} from "react-router-dom";
import {BreadCrumb} from "../../../component/breadcrumb";
import {TablePagination} from "../../../component/tablePagination";
import {form} from "../../../../common/decorator/form";
import {CommonUtils} from "../../../../common/utils/commonUtils";
import {Tabs, message} from "antd";
import {Routes} from "@/router/enum/routes";
import {User} from "../../../../common/beans/user";
import history from "../../../../router/history";
import {getGymGuardList, deleteGymGuard} from "@redux-actions/teaching/applyManage";
import {Modal} from "../../../component/customerCreateModal";
import '../applyManage/style/index'
import {FUNC} from "@/ui/pages/setting/enum/functions";

const TabPane = Tabs.TabPane;

@form()

class GymGuard extends React.Component<any, any> {
    //路由代码块
    private routes:Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching'
        },{
            name: '申请管理',
            path: '',
            link: '#',
            id: 'gymguard'
        }
    ];

    state = {
        table:{
            list: [],
            //分页的数据
            pageNo: 1,
            pageSize: 10,
            totalSize: 0
        },
        tabId: '3',
        defaultActiveKey: '3',
        activeKey: '3',
        id: null,
        visible: false,
    };


    componentDidMount() {
        this.handleSearch({});
    }

    /**
     * 改变tab key
     */
    onChangeTab = (activeKey) => {
        this.setState({ activeKey });
        if(activeKey === '1'){
            history.push(Routes.试听申请.path)
        }else if(activeKey === '2') {
            history.push(Routes.请假申请.path)
        }else if(activeKey === '3') {
        }
    };

    /**
     * 获取
     * @param body
     */
    handleSearch = (body:any = {}) => {
        this.setState({
            pageNo: 1,
            pageSize: 10
        });

        const postData = {
            "currentCenterId": User.currentCenterId,
            "pageNo": 1,
            "pageSize": 10
        };

        getGymGuardList(postData).then((res) => {
            this.setState({
                table: res
            })
        }, (err) => {
            //返回请求reject
            message.error(err.msg)
        })
    };

    /**
     * 分页变化
     * @param pageInfo
     */
    handleChangePageGym = (pageInfo:any) => {
        this.setState({
            table: {
                pageNo: pageInfo.pageNo,
                pageSize: pageInfo.pageSize,
            }
        },() => {
            this.handleChangePageGymguard({});
        });
    };
    /**
     * 教学分页搜索搜索
     * @param pageInfo
     */
    handleChangePageGymguard = (pageInfo:any) => {
        const postData = {
            "currentCenterId": User.currentCenterId,
            "pageNo": this.state.table.pageNo,
            "pageSize": this.state.table.pageSize
        };

        getGymGuardList(postData).then((res) => {
            this.setState({
                table: res
            })
        }, (err) => {
            //返回请求reject
            message.error(err.msg)
        })
    };

    /**
     * delete操作
     */
    deleteDetail = (record) => {
        this.setState({
            visible: true,
            id: record.id
        })

    };

    onCancel = () => {
        this.setState({
            visible: false,
            id: null
        })
    };

    onOk = () => {
        this.setState({
            visible: false,
        });

        deleteGymGuard({
            id:this.state.id,
            currentCenterId:User.currentCenterId
        }).then(()=>{
            message.success('删除Gym Guard成功!');
            this.handleSearch({})
        }, (err:any) => {
            message.error(err)
        })
    };

    /**
     * 权限控制
     * @param func key
     */
    isExist = (funcId)=> {
        const permissionList = User.permissionList;
        return permissionList.includes(funcId)
    };

    render() {
        const {table} = this.state;

        const gymguardColumns:any = [{
            title: '检查时间',
            dataIndex: 'checkTime',
            key: 'checkTime',
        }, {
            title: '教室',
            dataIndex: 'classroom',
            key: 'classroom',
        }, {
            title: '检查人1',
            dataIndex: 'firstCheckStaff',
            key: 'firstCheckStaff',
        }, {
            title: '检查人2',
            dataIndex: 'secondCheckStaff',
            key: 'secondCheckStaff',
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text:string, record:any) => (
                <div>
                    <button onClick={()=>this.deleteDetail(record)} className='gym-button-xxs gym-button-white'>删除</button>
                </div>
            )
        }];
        return (
            <div id='gym-contract-receive'>
                <BreadCrumb routes={this.routes} />
                <div className='gym-contract gym-apply-manage'>
                    <Tabs
                        defaultActiveKey={this.state.defaultActiveKey}
                        onChange={this.onChangeTab}
                        activeKey={this.state.activeKey}
                        type="card"
                        tabBarGutter={10}
                    >
                        {
                            this.isExist(`${FUNC[`试听申请`]}`) &&
                            <TabPane tab="试听申请" key="1">
                                <div>
                                </div>
                            </TabPane>
                        }
                        {
                            this.isExist(`${FUNC[`请假申请`]}`) &&
                            <TabPane tab="请假申请" key="2">
                                <div>
                                </div>
                            </TabPane>
                        }
                        {
                            this.isExist(`${FUNC[`GYM Guard`]}`) &&
                            <TabPane tab="Gym Guard" key="3">
                                <div className='page-wrap gym-apply-manage-tab-content' style={{paddingTop: 0}}>
                                    {
                                        this.isExist(`${FUNC[`临时排课`]}`) &&
                                        <Link to={`${Routes.课程表.link}${CommonUtils.stringify({
                                            id: 'temporary',
                                            fromGymGuard: true
                                        })}`}>
                                            <button style={{width: '110px'}}
                                                    className='gym-button-xs gym-button-default mt30 mb20 ml30'>+&nbsp;&nbsp;&nbsp;新建检查
                                            </button>
                                        </Link>
                                    }
                                    <br/>
                                    <TablePagination
                                        columns={gymguardColumns}
                                        rowKey={'id'}
                                        dataSource={table.list || []}
                                        totalSize={table.totalSize}
                                        pageSize={table.pageSize}
                                        handleChangePage={this.handleChangePageGym}
                                        pageNo={table.pageNo}
                                    />
                                </div>
                            </TabPane>
                        }
                    </Tabs>
                </div>
                <Modal
                    visible={this.state.visible}
                    handleOk={this.onOk}
                    handleCancel={this.onCancel}
                    contentText='确定要删除这条Gym Guard吗？'
                />
            </div>
        )
    }
}

export {GymGuard}
