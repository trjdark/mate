import * as React from "react";
import {form} from "@/common/decorator/form";
import history from "@/router/history";
import {ContractRoutes} from "@/router/enum/contractRoutes";
import {hasLegalGuardian, updateFollowInfo, updateLeadsInfo} from "@redux-actions/customer/customerAcquire";
import {Message} from "@/ui/component/message/message";
import {CommonUtils} from "@/common/utils/commonUtils";
import {User} from "@/common/beans/user";
import {Modal} from "@/ui/component/customerCreateModal";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {FUNC} from "@/ui/pages/setting/enum/functions";

declare interface InnerProps {
    title: string,
    type?: string,// 右上角字段-编辑、新建（合同）
    onReload?: (title) => (void),// 编辑完成后重新更新页面数据
    leadsInfo?: any,// leads信息，主要为判断promotor是否为离职员工
    leadsId?: string,
    // 以下为自身props
    form?: any,
    addContractFlag?:boolean,  // 新建合同开关
}

@form()
class CommonPart extends React.Component<InnerProps, any> {
    state = {
        isEditable: false,
        dynamicWord: this.props.type,
        showLegalGuardian: false,
        showSetInfo: false
    };
    toggleEdit = () => {
        const {title, onReload, leadsId, leadsInfo, addContractFlag} = this.props;
        const {dynamicWord} = this.state;
        if (this.props.type === '编辑') {
            const isEditable = this.state.isEditable;

            if (isEditable) {// 点击保存
                this.props.form.validateFields((err, values) => {
                    if (err) {
                        for (let key in err) {// 给出第一个错误信息提示
                            if (err.hasOwnProperty(key)) {
                                Message.error(err[key].errors[0].message);
                                return;
                            }
                        }
                    }
                    values.currentCenterId = User.currentCenterId;
                    values.leadsId = leadsId;
                    if (title === 'Leads信息') {// leads信息保存
                        if (values.promotorId === leadsInfo.promotorName) {
                            values.promotorId = leadsInfo.promotorId;
                        }
                        updateLeadsInfo(values).then(() => {
                            this.setState({
                                isEditable: !isEditable,
                                dynamicWord: isEditable ? '编辑' : '保存',
                            });
                            onReload('Leads信息');
                        })
                    } else if (title === '跟进信息') {
                        updateFollowInfo(values).then(() => {
                            this.setState({
                                isEditable: !isEditable,
                                dynamicWord: isEditable ? '编辑' : '保存',
                            });
                            onReload('跟进信息');
                        })
                    }
                })
            } else {
                this.setState({
                    isEditable: !isEditable,
                    dynamicWord: isEditable ? '编辑' : '保存',
                });
            }
        } else {// 新建合同页面,如果为非销售中心，不跳转
            if(addContractFlag){
                return;
            }
            const params = {
                currentCenterId: User.currentCenterId,
                leadsId: this.props.leadsId,
            };
            // 获取是否有法定监护人
            hasLegalGuardian(params).then(
                (res) => {
                    if (!!res.hasLegalGuardian) {
                        history.push(`${ContractRoutes.新建合同.link}${CommonUtils.stringify({ leadsId: leadsId })}`);
                    } else {
                        this.setState({ showLegalGuardian: true })
                    }
                },
                (err) => {}
            );
        }
    };

    componentDidMount() {
        const {title} = this.props;
        if (title === 'Leads信息' && !User.permissionList.includes(FUNC["编辑leads信息"])) {// leads信息编辑按钮权限控制
            this.setState({dynamicWord: false})
        }
    }

    handleCancel = () => {
        this.setState({showLegalGuardian: false})
    };
    handleOk = () => {
        this.setState({showLegalGuardian: false});
        const param = {
            leadsId: this.props.leadsId,
            title: 1,
            url: `${CustomerRoutes.客户获取.link}/${CommonUtils.stringify(
                {leadsId: this.props.leadsId, id: '2'})}`
        };
        history.push(`${CustomerRoutes.客户360基本信息.link}/${CommonUtils.stringify(param)}`)
    };

    render() {
        const {children, form, addContractFlag} = this.props;
        const { isEditable, dynamicWord, showLegalGuardian,} = this.state;
        const childrenWithProps = React.Children.map(children, child => React.cloneElement(
            child,
            {
                isEditable: isEditable,
                form: form,
            }
        ));
        return (
            <div className='bgWhite'>
                <header>
                    {dynamicWord &&
                    <button className={`gym-button-${ (dynamicWord === '+ 新建' && addContractFlag) ? 'grey' :'default'}-xs ml30 mt15 mb20`}
                            onClick={this.toggleEdit}>
                        {dynamicWord}
                    </button>}
                </header>
                {childrenWithProps}
                <Modal
                    visible={showLegalGuardian}
                    okText={`去设置`}
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                    contentText="该用户暂未设置法定监护人，请设置"
                />
            </div>)
    }
}

export {CommonPart}
