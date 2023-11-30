/**
 * desc: 员工数据详情
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/1/6
 * Time: 下午6:54
 */
import React from 'react';
import {Form, Row, Col} from 'antd';
import {PageTitle} from "../../../../component/pageTitle";
import {
    GenderType,
    CardType,
    PostStatus,
} from "../../enum/employee";
import {
    selectEmployeePost,
    selectAllCenterList,
} from "@/saga/selectors/setting/employee";
import {connect} from "@/common/decorator/connect";
import {CommonUtils} from "@/common/utils/commonUtils";
import {
    getEmployeeInfo,
    getEmployeePost, getEmployeeRole
} from "@redux-actions/setting/employee";
import {User} from "@/common/beans/user";
import moment from "moment";
import {PostRoleTable} from "@/ui/pages/setting/employee/part/postRoleTable";

const FormItem = Form.Item;

@connect((state: any) => ({
    centerList: selectAllCenterList(state),
    postList: selectEmployeePost(state),
}), {})
class EmployeeDataDetail extends React.Component<any, any> {
    pid = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).id : null;
    constructor(props:any){
        super(props);
        this.state = {
            isWorking: false,
            postPage: 1,//岗位列表
            rolePage: 1,//角色列表
            shouldShowMore: true,//是否显示更多
            canFetchStaffRole:true,//能否执行Dynamic组件的getDerivedFromProps
            employeeInfo: {},         // 员工信息
            employeePostInfo: [],     // 岗位列表
            employeeRoleInfo: [],     // 角色列表
            dataSource: [],           // 岗位角色列表数据

        };
    }
    componentDidMount() {
        if (this.pid) {// 编辑
            const param = {
                id: this.pid,
                currentCenterId: User.currentCenterId,
                staffId: this.pid
            };
            Promise.all([
                getEmployeeInfo(param),
                getEmployeePost(param),
                getEmployeeRole(param),
            ]).then((res:Array<any>) => {
                const [employeeInfo, employeePostInfo, employeeRoleInfo] = res;
                const dataSource = this.dataSourceFormate(employeePostInfo, employeeRoleInfo);
                this.setState({
                    employeeInfo,
                    employeePostInfo,
                    employeeRoleInfo,
                    dataSource,
                })
            });
        }
    }

    /**
     * 岗位，角色数据格式化
     * @param postList
     * @param roleList
     */
    dataSourceFormate = (postList, roleList) => {
        const result = postList.map((post:any) => {
            post.roleList = roleList.filter((role) => role.centerId === post.centerId);
            return post;
        });
        return result;
    };

    /**
     * 修改数据
     */
    handleChangeData = (value, i, type:any) => {
        const {dataSource} = this.state;
        if(type === 'delete'){
            this.setState(prevState => ({
                dataSource: [
                    ...prevState.dataSource.slice(0, i),
                    ...prevState.dataSource.slice(i + 1)
                ]
            }));
            return;
        }
        const data = dataSource.map((item, index) => {
            if(index === i){
                switch (type) {
                    case 'centerId':
                        return Object.assign({}, item, {
                            centerId: value.id,
                            centerCode: value.centerCode,
                            centerName: value.centerName,
                            roleList: []
                        });
                    case 'postId':
                        return Object.assign({}, item, {
                            postId: value.id,
                            postCode: value.postCode,
                            postName: value.postName,
                            roleList: []
                        });
                    case 'roleId':
                        return Object.assign({}, item, {
                            roleList: value
                        });
                }
            }else{
                return item
            }
        });
        this.setState({dataSource:data})
    };
    /**
     * 添加新岗位角色
     */
    handleInsertData = (node) => {
        this.setState(prevState => ({
            dataSource:[...prevState.dataSource, node]
        }))
    };
    render() {
        let {centerList, postList} = this.props;
        const {employeeInfo, dataSource} = this.state;
        let statusList = [];
        if(User.tmkStatus.isAccountNumberGrayCenter){
            statusList = [...PostStatus, {
                key: 'PostStatus_1',
                name: '锁定',
                value: 2
            }]
        }else{
            statusList = [...PostStatus];
        }

        centerList = User.isHQ ? centerList : ([
            {
                id: User.currentCenterId,
                centerName: User.currentCenterName,
                centerCode: User.centerCode
            }
        ]);
        return (
            <div className='gym-employee-add'>
                <PageTitle title={`员工信息`}/>
                <div >
                    <Row>
                        <Col span={8}>
                            <FormItem label={`中文名`} className='gym-employee-add-form-item'>
                                <span>{employeeInfo.chineseName}</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={`英文名`} className='gym-employee-add-form-item'>
                                <span>{employeeInfo.englishName}</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={`性别`} className='gym-employee-add-form-item'>
                                <span>
                                    {GenderType.filter((item) => item.value === employeeInfo.gender)[0]
                                        ? GenderType.filter((item) => item.value === employeeInfo.gender)[0].name
                                        : '-'
                                    }
                                </span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label={`证件类型`} className='gym-employee-add-form-item'>
                                <span>
                                    {CardType.filter((item) => item.value === employeeInfo.idcardType)[0]
                                        ? CardType.filter((item) => item.value === employeeInfo.idcardType)[0].name
                                        : '-'
                                    }
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={`证件号码`} className='gym-employee-add-form-item'>
                                <span>{employeeInfo.idcard}</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={`手机号码`} className='gym-employee-add-form-item'>
                                <span>{employeeInfo.mobile}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label={`在职状态`} className='gym-employee-add-form-item'>
                                <span>
                                    {statusList.filter((item) => item.value === employeeInfo.workingStatus)[0]
                                        ? statusList.filter((item) => item.value === employeeInfo.workingStatus)[0].name
                                        : '-'
                                    }
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={`入职时间`} className='gym-employee-add-form-item'>
                                <span>{employeeInfo.entryDate ? moment(employeeInfo.entryDate).format('YYYY-MM-DD'):'-'}</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={`离职时间`} className='gym-employee-add-form-item'>
                                <span>{employeeInfo.leaveDate ? moment(employeeInfo.leaveDate).format('YYYY-MM-DD'):'-'}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label={`邮箱地址`} className='gym-employee-add-form-item'>
                                <span>{employeeInfo.email}</span>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={`用户名`} className='gym-employee-add-form-item gym-wide-form-control'>
                                <span>{employeeInfo.username}</span>
                            </FormItem>
                        </Col>

                        <Col span={8}>
                            <FormItem label={`所属主中心`} className='gym-employee-add-form-item'>
                                <span>
                                    {centerList.filter((item) => item.id === employeeInfo.primaryCenterId)[0]
                                        ? `${centerList.filter((item) => item.id === employeeInfo.primaryCenterId)[0].centerCode}-${centerList.filter((item) => item.id === employeeInfo.primaryCenterId)[0].centerName}`
                                        : '-'
                                    }
                                </span>
                            </FormItem>
                        </Col>

                    </Row>
                    <PageTitle title={`岗位/角色分配`}/>
                    <PostRoleTable
                        dataSource={dataSource}
                        centerList={centerList}
                        postList={postList}
                        emitChangeData={this.handleChangeData}
                        emitInsertData={this.handleInsertData}
                    />
                </div>
            </div>
        )
    }
}

export {EmployeeDataDetail}
