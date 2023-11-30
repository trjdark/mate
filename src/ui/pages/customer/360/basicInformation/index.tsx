import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {CreateProgress} from "@/ui/pages/customer/create/part/createProgress";
import {AddressInformation} from '@/ui/pages/customer/create/part/addressInfo'
import {TabForm} from "@/ui/pages/customer/create/part/tabForm";
import {TabFormContact} from "@/ui/pages/customer/create/part/tabFormContact";
import {form} from "@/common/decorator/form";
import {
    updateCustomerBabyInfo,
    updateCustomerContactInfo,
    updateCustomerAddressInfo,
    getCodeInfoByTypeRedux, hasPermissonToEdit,
} from '@redux-actions/client360';
import {User} from "@/common/beans/user";
import {connect} from "@/common/decorator/connect";
import {CommonUtils} from '@/common/utils/commonUtils';
import {selectEditPermission} from "@/saga/selectors/customer/client360";
import {
    getBabyInformation, getCustomerContactInfo, getLeadsOperatedLogInfo,
    getCustomerAddressInfo
} from "@redux-actions/client360";
import { CustomerRoutes } from "@/router/enum/customerRoutes";
import {Message} from "@/ui/component/message/message";

@form()
@connect(state => ({
    editPermission: selectEditPermission(state).hasEditPermission,
    editPhonePermission: selectEditPermission(state).hasModifiedMobilePermission,
    isPhoneEdit: selectEditPermission(state).hasModifiedMobilePermission
}), {getCodeInfoByTypeRedux, hasPermissonToEdit})
class BasicInformation360 extends React.Component<any, any> {
    leadsId:string;
    title:string;
    url:string;
    private routes: Array<any> = [
        {name: '客户', path: '', link: '#', id: 'customer'},
        {name: '客户360', path: '', link: '#', id: 'client360'},
        {name: '基本信息', path: '', link: '#', id: 'client360basicInfo'}
    ];
    constructor(props) {
        super(props);
        this.props.getCodeInfoByTypeRedux({
            type: 'familyRelation',
            currentCenterId: User.currentCenterId
        })

        if (CommonUtils.hasParams(this.props)) {
            this.leadsId = CommonUtils.parse(this.props).leadsId;
            this.title = CommonUtils.parse(this.props).title;
            this.url = CommonUtils.parse(this.props).url;
        }

        this.state = {
            step: this.title || 0,
            leadsId: this.leadsId,
            babys: [],
            contacts: [],
            logInfoList: [],
            addressInfo: {},
            editPermission: true,
            editPhonePermission: false,
        }
    }

    componentDidMount() {
        const param = {
            currentCenterId: User.currentCenterId,
            leadsId: this.leadsId
        };
        this.props.hasPermissonToEdit(param)
        Promise.all([
            getBabyInformation(param),
            getCustomerContactInfo(param),
            getLeadsOperatedLogInfo(param),
            getCustomerAddressInfo(param)
        ]).then((res) => {
            const [babys, contacts, logInfoList, addressInfo] = res;
            this.setState({
                babys:babys,
                contacts: contacts,
                logInfoList: logInfoList,
                addressInfo: addressInfo,
            })
        })
    }
    /**
     * 保存宝宝信息
     */
    handleSaveBaby = (babys:any) => {
        const { editPermission } = this.props;
        if (editPermission===false){
            this.setState(prevState => {
                return { step: prevState.step + 1 }
            })
            return false
        }
        const param = {
            currentCenterId: User.currentCenterId,
            leadsId: this.state.leadsId,
            updateBabyInfoList: babys
        };
        updateCustomerBabyInfo(param).then(() => {
            Message.success('修改成功!', 2, () => {
                this.pageRefresh(0)
            });
        });

    };
    /**
     * 保存联系人信息
     * @param contacts
     */
    handleSaveContact = (contacts:any) => {
        const { editPermission } = this.props;
        if (editPermission === false) {
            this.setState(prevState => {
                return { step: prevState.step + 1 }
            })
            return false
        }
        const param = {
            currentCenterId: User.currentCenterId,
            leadsId: this.state.leadsId,
            updateContactInfoList: contacts
        }
        updateCustomerContactInfo(param).then(() => {
            Message.success('修改成功！');
            this.pageRefresh(1)
        });
    };
    /**
     * 保存住址信息
     */
    handleSaveAddress = (addressInfo:any) => {
        const param = Object.assign({}, addressInfo, {
            leadsId: this.state.leadsId,
            currentCenterId: User.currentCenterId,
        });
        updateCustomerAddressInfo(param).then(() => {
            Message.success('修改成功！', 2, () => this.pageRefresh);
        });
    };
    /**
     * 切换
     * @param step
     */
    changeStep = (step) => {
        this.setState({step: step})
    };
    /**
     * 上一步
     */
    prev = () => {
        this.setState( prevState => {
            return {step: prevState.step - 1}
        })
    };
    /**
     * 刷新
     */
    pageRefresh = (idx) => {
        if (this.url) {
            this.props.history.push(this.url);
            return;
        }
        let param = { leadsId: this.leadsId, title: idx }
        setTimeout(() => {
            this.props.history.replace(`${CustomerRoutes.客户360基本信息.link}/${CommonUtils.stringify(param)}`)
        })
    };

    render() {
        const { editPermission, isPhoneEdit,} = this.props;
        const {step, babys, contacts, addressInfo, logInfoList} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <CreateProgress
                    textList={['宝宝信息', '联系人信息', '住址信息']}
                    step={step}
                    isEdit={editPermission}
                    emitClick={this.changeStep}
                />
                <TabForm
                    emitNext={this.handleSaveBaby}
                    style={{display:step === 0 ? 'block' : 'none'}}
                    babys={babys}
                    isEdit={editPermission}
                    logInfoList={logInfoList}
                />
                <TabFormContact
                    emitNext={this.handleSaveContact}
                    emitPrev={this.prev}
                    style={{display:step === 1 ? 'block' : 'none'}}
                    contacts={contacts}
                    isEdit={editPermission}
                    isPhoneEdit={isPhoneEdit}
                />
                <AddressInformation
                    emitNext={this.handleSaveAddress}
                    emitPrev={this.prev}
                    style={{display:step === 2 ? 'block' : 'none'}}
                    data={addressInfo}
                    isEdit={editPermission}
                    leadsId={this.leadsId}
                />

            </Fragment>
        )
    }
}

export {BasicInformation360};
