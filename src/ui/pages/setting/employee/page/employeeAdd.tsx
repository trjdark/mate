/**
 * desc:
 * Date: 2018/8/16
 * Time: 上午10:56
 */
import React from 'react';
import {Form, Row, Col, DatePicker} from 'antd';
import {Input} from "../../../../component/input";
import {PageTitle} from "../../../../component/pageTitle";
import {form} from "../../../../../common/decorator/form";
import {
    GenderType, DefaultGenderType,
    CardType, DefaultCardType,
    PostStatus,
} from "../../enum/employee";
import {
    selectEmployeePost,
    selectAllCenterList,
} from "@/saga/selectors/setting/employee";
import {connect} from "@/common/decorator/connect";
import {CommonUtils} from "@/common/utils/commonUtils";
import {
    addEmployee, editEmployee, getEmployeeInfo,
    getEmployeePost, getEmployeeRole, editUnHQEmployee
} from "@redux-actions/setting/employee";
import {CancelButton} from "@/ui/component/cancelButton";
import {Routes} from "@/router/enum/routes";
import {User} from "@/common/beans/user";
import moment from "moment";
import {Message} from "@/ui/component/message/message";
import {handleValidate, Validation} from "@/common/utils/validate";
import {Select, Option as SelectOption} from "@/ui/component/select";
import _ from 'lodash';
import history from '@/router/history.ts';
import {PostRoleTable} from "@/ui/pages/setting/employee/part/postRoleTable";

const FormItem = Form.Item;

@form()
@connect((state: any) => ({
    centerList: selectAllCenterList(state),
    postList: selectEmployeePost(state),
}), {})
class EmployeeAdd extends React.Component<any, any> {
    SIZE = 50;
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
     * 将角色列表，岗位列表进行分页
     * @param arr
     * @param size:每页几条
     * @returns {any}
     */
    getPageDevide = (arr, size) => {
        const len = arr.length;
        let pageNo = 0;
        const totalPage = Math.ceil(len / size), newArr = new Array(totalPage).fill('').map(u => ([]));
        if (!totalPage) return [];
        for (let i = 0; i < len; i++) {
            if (i < (pageNo + 1) * size) {
                newArr[pageNo].push(arr[i])
            } else {
                pageNo++;
                newArr[pageNo].push(arr[i]);
            }
        }
        return newArr;
    };

    /**
     * 判断两个数组是否相等
     * @param roleList
     * @param roleList2
     * @returns {boolean}
     */
    equalArray = (roleList, roleList2):boolean => {
        let index = 0;
        while (roleList[index] || roleList2[index]){
            const num1 = roleList[index + 1] ? 1 : 0;
            const num2 = roleList2[index + 1] ? 1 : 0;
            if(num1 !== num2){
                return false;
            }
            if(roleList[index].roleId !== roleList2[index].roleId){
                return false;
            }
            index++;
        }

        return true;
    };
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {dataSource} = this.state;
                const posts = dataSource.map((post) => ({centerId: post.centerId, postId: post.postId}));
                const roles = dataSource.map(post => post.roleList)
                                        .reduce((pre = [], cur = []) => [...pre, ...cur], [])
                                        .map(role => ({roleId: role.roleId, centerId: role.centerId}));
                const params = Object.assign({}, values, {
                    currentCenterId: User.currentCenterId,
                    posts,
                    roles,
                });
                if (this.pid) {// 编辑
                    if(User.isHQ){
                        editEmployee({...params, id: this.pid, staffId: this.pid}).then(() => {
                            Message.success('更新成功！');
                        });
                    }else{
                        const {employeeInfo, employeePostInfo, dataSource, employeeRoleInfo} = this.state;
                        let nhqUpdateRequests = [];
                        let staffPostLogRequests = [];
                        let roleLogRequest:any = {};
                        for(let key in employeeInfo){
                            // 如果存在键，并且值不相等
                            if((values.hasOwnProperty(key) && employeeInfo.hasOwnProperty(key)) && (employeeInfo[key] !== values[key])){
                                if((key === 'entryDate' || key === 'leaveDate') && (employeeInfo[key] !== (values[key] ? values[key].valueOf() : null))){
                                    nhqUpdateRequests.push({
                                        afterValue: values[key] ? values[key].valueOf().toString():null,
                                        beforeValue: employeeInfo[key] ? employeeInfo[key].valueOf().toString():null,
                                        fieldsName: key,
                                        updateType: '1007001',
                                    })
                                }
                                if(key !== 'entryDate' && key !== 'leaveDate'){
                                    nhqUpdateRequests.push({
                                        afterValue: values[key],
                                        beforeValue: employeeInfo[key],
                                        fieldsName: key,
                                        updateType: '1007001',
                                    })
                                }
                            }
                        }
                        if(employeePostInfo[0].postId !== dataSource[0].postId){
                            staffPostLogRequests.push({
                                afterPostId: dataSource[0].postId,
                                afterPostName: dataSource[0].postName,
                                beforePostId: employeePostInfo[0].postId,
                                beforePostName: employeePostInfo[0].postName
                            })
                        }
                        if(!this.equalArray(employeeRoleInfo, dataSource[0].roleList)){
                            roleLogRequest.beforeRoleIds = employeeRoleInfo.map(role => role.roleId).join(',');
                            roleLogRequest.beforeRoleNames = employeeRoleInfo.map(role => role.roleName).join(',');
                            roleLogRequest.afterRoleIds = dataSource[0].roleList.map(role => role.roleId).join(',');
                            roleLogRequest.afterRoleNames = dataSource[0].roleList.map(role => role.roleName).join(',');
                        }
                        const param = {
                            currentCenterId:User.currentCenterId,
                            staffId: employeeInfo.id,
                            staffPostName: employeePostInfo[0].postName,
                            nhqUpdateRequests,
                            staffPostLogRequests,
                            roleLogRequest
                        };
                        editUnHQEmployee(param).then(() => {
                            Message.success('申请成功！', 2, () => {
                                history.goBack();
                            })
                        })
                    }
                } else {// 新建
                    addEmployee(params).then(() => {
                        Message.success('创建成功！');
                    });
                }
            }
        })
    };
    /**
     * 获取除页面显示角色，岗位外所有posts, roles
     * @returns {any}
     */
    getRestData = () => {
        const params = {posts: [], roles: []};
        const {employeePostInfo, employeeRoleInfo} = this.state;
        const {postPage, rolePage} = this.state;
        const postPageData = this.getPageDevide(employeePostInfo, this.SIZE);
        const rolePageData = this.getPageDevide(employeeRoleInfo, this.SIZE);
        if (postPageData.length === postPage) {
            params.posts = [];
        } else {
            const restPostPage = _.drop(postPageData, postPage);
            const restPostPageList = Array.prototype.concat.apply([], restPostPage);
            params.posts = ((restPostPageList.map(({centerId, postId}) => ({
                centerId, postId
            }))));
        }
        if (rolePageData.length === rolePage) {
            params.roles = [];
        } else {
            const restRolePage = _.drop(rolePageData, rolePage);
            const restRolePageList = Array.prototype.concat.apply([], restRolePage);
            params.roles = ((restRolePageList.map(({centerId, roleId}) => ({
                centerId, roleId
            }))));
        }

        return params;

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
        const {getFieldDecorator} = this.props.form;
        let {centerList, form, postList} = this.props;
        const {employeeInfo, dataSource} = this.state;
        const shouldPrimaryCenterChange = User.isHQ && User.role.includes('ADMIN');
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
                <PageTitle title='员工信息'/>
                <Form onSubmit={this.onSubmit}>
                    <Row>
                        <Col span={8}>
                            <FormItem label='中文名' className='gym-employee-add-form-item'>
                                {
                                    getFieldDecorator('chineseName', {
                                        rules: [{
                                            required: true, message: "请输入中文名", whitespace: true
                                        },
                                            {validator: handleValidate[Validation.非空格]}
                                        ],

                                        initialValue: employeeInfo.chineseName,
                                    })(
                                        <Input
                                            disabled={this.pid && !User.isHQ}
                                            placeholder='中文名'
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='英文名' className='gym-employee-add-form-item'>
                                {
                                    getFieldDecorator('englishName', {
                                        rules: [{
                                            required: true, message: "请输入英文名"
                                        }],
                                        initialValue: employeeInfo.englishName,
                                    })(
                                        <Input
                                            disabled={this.pid && !User.isHQ}
                                            placeholder='英文名'
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='性别' className='gym-employee-add-form-item'>
                                {
                                    getFieldDecorator('gender', {
                                        rules: [{
                                            required: true,
                                        }],
                                        initialValue: employeeInfo.gender !== undefined ? employeeInfo.gender : DefaultGenderType
                                    })(
                                        <Select
                                            className='gym-employee-add-select'
                                            disabled={this.pid && !User.isHQ}
                                        >
                                            {
                                                GenderType.map((item: any) => (
                                                    <SelectOption key={item.key} value={item.value}>
                                                        {item.name}
                                                    </SelectOption>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label='证件类型' className='gym-employee-add-form-item'>
                                {
                                    getFieldDecorator('idcardType', {
                                        rules: [{
                                            required: true,
                                        }],
                                        initialValue: employeeInfo.idcardType || DefaultCardType
                                    })(
                                        <Select
                                            className='gym-employee-add-select'
                                            disabled={this.pid && !User.isHQ}
                                        >
                                            {
                                                CardType.map((item: any) => (
                                                    <SelectOption key={item.key} value={item.value}>
                                                        {item.name}
                                                    </SelectOption>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='证件号码' className='gym-employee-add-form-item'>
                                {
                                    getFieldDecorator('idcard', {
                                        rules: [{
                                            required: true, message: "请输入证件号码"
                                        }],
                                        initialValue: employeeInfo.idcard
                                    })(
                                        <Input
                                            placeholder='证件号码' maxLength={36}
                                            disabled={this.pid && !User.isHQ}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='手机号码' className='gym-employee-add-form-item'>
                                {
                                    getFieldDecorator('mobile', {
                                        rules: [{required: true, validator: handleValidate[Validation.手机号]},
                                        ],
                                        initialValue: employeeInfo.mobile
                                    })(
                                        <Input
                                            placeholder='手机号码'
                                            maxLength={11}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label='在职状态' className='gym-employee-add-form-item'>
                                {
                                    getFieldDecorator('workingStatus', {
                                        rules: [{
                                            required: true,
                                        }],
                                        initialValue: (employeeInfo.workingStatus !== undefined) ? employeeInfo.workingStatus : 1
                                    })(
                                        <Select className='gym-employee-add-select'>
                                            {
                                                statusList.map((item: any) => (
                                                    <SelectOption
                                                        key={item.key}
                                                        value={item.value}
                                                        disabled={!User.isHQ && (item.value === 1 || item.value === 2)}
                                                    >
                                                        {item.name}
                                                    </SelectOption>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='入职时间' className='gym-employee-add-form-item'>
                                {
                                    getFieldDecorator('entryDate', {
                                        initialValue: employeeInfo.entryDate && moment(employeeInfo.entryDate)
                                    })(
                                        <DatePicker/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='离职时间' className='gym-employee-add-form-item'>
                                {
                                    getFieldDecorator('leaveDate', {
                                        rules: [{
                                            required: form.getFieldValue('workingStatus') === 0,
                                            message: '请输入离职时间'
                                        }],
                                        initialValue: employeeInfo.leaveDate && moment(employeeInfo.leaveDate)
                                    })(
                                        <DatePicker/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label='邮箱地址' className='gym-employee-add-form-item'>
                                {
                                    getFieldDecorator('email', {
                                        initialValue: employeeInfo.email

                                    })(
                                        <Input placeholder='邮箱地址'/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='用户名' className='gym-employee-add-form-item gym-wide-form-control'>
                                {
                                    getFieldDecorator('username', {
                                        rules: [
                                            {required: true, message: "请输入用户名"},
                                            {validator: this.pid ? null : handleValidate[Validation.用户名]}
                                        ],
                                        initialValue: employeeInfo.username

                                    })(
                                        <Input disabled={!!employeeInfo.username} placeholder='只允许由英文、数字、点号组成'/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='所属主中心' className='gym-employee-add-form-item'>
                                {
                                    // 如果编辑状态下则不能编辑
                                    (this.pid && !User.isHQ)
                                        ?
                                        [getFieldDecorator('primaryCenterId', {
                                            initialValue: employeeInfo.primaryCenterId
                                        })(<span key={'hide-input'}/>),
                                            <Input key={'show-input'} disabled={true}
                                                   value={employeeInfo.primaryCenterName}/>]
                                        :
                                        getFieldDecorator('primaryCenterId', {
                                            rules: [{required: true,  message: "请选择所属主中心"}],
                                            initialValue: employeeInfo.primaryCenterId
                                        })(
                                            <Select
                                                disabled={!shouldPrimaryCenterChange}
                                                showSearch={true}
                                                optionFilterProp="children"
                                                className='gym-employee-add-select'>
                                                {
                                                    centerList.map((item: any) => (
                                                        <SelectOption key={item.id} value={item.id}>
                                                            {item.centerCode}-{item.centerName}
                                                        </SelectOption>
                                                    ))
                                                }
                                            </Select>
                                        )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <PageTitle title='岗位/角色分配'/>
                    <PostRoleTable
                        dataSource={dataSource}
                        centerList={centerList}
                        postList={postList}
                        emitChangeData={this.handleChangeData}
                        emitInsertData={this.handleInsertData}
                    />
                    <CancelButton form={this.props.form} goBackLink={Routes.员工信息列表.path}/>
                </Form>


            </div>
        )
    }
}

export {EmployeeAdd}
