/**
 * desc: description
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {Redirect, Switch, matchPath, Route} from "react-router";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {AuthorizedRoute} from "@/router/authorizedRoute";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {User} from "@/common/beans/user";
import {connect} from "@/common/decorator/connect";
import {FUNC} from "@/ui/pages/setting/enum/functions";

@connect((state) => ({}), {})

class ContractListRoute extends React.Component<any, any> {
    private routes:Array<any> = [
        {
            name: '合同',
            path: '',
            link: '#',
            id: 'contract'
        },{
            name: '合同操作',
            path: '',
            link: '#',
            id: 'contractAction'
        }
    ];
    constructor(props: any) {
        super(props);
        this.state = {
            items: []
        }
    }
    componentDidMount() {
        this.setItems();
    }

    isExist = (funcId)=> {
        const permissionList = User.permissionList;
        return permissionList.includes(funcId)
    };

    /**
     * 设置items
     */
    setItems = () => {
        let contractTabList = [];
        if(this.isExist(`${FUNC[`过期合同收入确认`]}`)){
            contractTabList.push(
                {
                    name:'过期合同确认收入',
                    url: Routes.合同操作列表过期确认收入.path
                }
            )
        }
        if(this.isExist(`${FUNC[`转中心申请`]}`)){
            contractTabList.push(
                {
                    name:'转中心申请',
                    url: Routes.合同操作列表转中心.path
                }
            )
        }
        if(this.isExist(`${FUNC[`退课申请`]}`)){
            contractTabList.push(
                {
                    name:'退课申请',
                    url: Routes.合同操作列表退课.path
                }
            )
        }
        if(this.isExist(`${FUNC[`改包申请`]}`)){
            contractTabList.push(
                {
                    name:'改包申请',
                    url: Routes.合同操作列表改包.path
                }
            )
        }
        if(this.isExist(`${FUNC[`合同延期申请`]}`)){
            contractTabList.push(
                {
                    name:'合同延期申请',
                    url: Routes.合同操作列表延期.path
                }
            )
        }
        if(this.isExist(`${FUNC[`请假次数修改申请`]}`)){
            contractTabList.push(
                {
                    name:'请假次数修改申请',
                    url: Routes.合同操作列表修改请假次数.path
                }
            )
        }
        if(this.isExist(`${FUNC[`赠课申请`]}`)){
            contractTabList.push(
                {
                    name:'赠课申请',
                    url: Routes.合同操作列表赠课.path
                }
            )
        }
        if(this.isExist(`${FUNC[`合同调整申请`]}`)){
            contractTabList.push(
                {
                    name:'合同调整申请',
                    url: Routes.合同调整申请.path
                }
            )
        }
        if(this.isExist(`${FUNC[`部分退费申请`]}`)){
            contractTabList.push(
                {
                    name:'部分退费申请',
                    url: Routes.部分退费申请.path
                }
            )
        }
        this.setState({
            items: contractTabList
        })
    };

    render(){
        const {items} = this.state;

        return(
            <div className='gym-contract-operation'>
                <BreadCrumb routes={this.routes} />
                <div className='gym-contract-operation-items'>
                    {
                        items.map((item:any, index:number) =>
                            <Link
                                to={item.url}
                                key={`item_${index}`}
                                className={`gym-contract-operation-item ${matchPath(location.pathname, {path: item.url}) ? 'active' : ''}`}
                            >
                                {item.name}
                            </Link>
                        )
                    }
                </div>
                <Switch>
                    <Redirect strict={true} exact={true} to={Routes.合同操作列表过期确认收入.path} from={Routes.合同操作.path}/>
                    {/*列表页面*/}
                    <AuthorizedRoute exact={true}{...Routes.合同操作列表转中心}/>
                    <AuthorizedRoute exact={true}{...Routes.合同操作列表过期确认收入}/>
                    <AuthorizedRoute exact={true}{...Routes.合同操作列表延期}/>
                    <AuthorizedRoute exact={true}{...Routes.合同操作列表退课}/>
                    <AuthorizedRoute exact={true}{...Routes.合同操作列表改包}/>
                    <AuthorizedRoute exact={true}{...Routes.合同操作列表修改请假次数}/>
                    <AuthorizedRoute exact={true}{...Routes.合同操作列表赠课}/>
                    <AuthorizedRoute exact={true}{...Routes.合同调整申请}/>
                    <AuthorizedRoute exact={true}{...Routes.部分退费申请}/>
                </Switch>
            </div>
        )
    }
}


class ContractAction extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <div>
                <Switch>
                    <Route path='/contract/contractAction/contractActionList/' component={ContractListRoute}/>
                    {/*详情操作页面*/}
                    <AuthorizedRoute exact={true}{...Routes.合同操作详情转中心}/>
                    <AuthorizedRoute exact={true}{...Routes.合同操作详情延期}/>
                    <AuthorizedRoute exact={true}{...Routes.合同操作详情退课}/>
                    <AuthorizedRoute exact={true}{...Routes.合同操作详情改包}/>
                    <AuthorizedRoute exact={true}{...Routes.合同操作详情修改请假次数}/>
                    <AuthorizedRoute exact={true} {...Routes.合同操作详情赠课}/>
                    <AuthorizedRoute exact={true}{...Routes.合同操作详情调整}/>
                    <AuthorizedRoute exact={true}{...Routes.合同操作详情部分退费}/>
                </Switch>
            </div>
        )
    }
}

export {ContractAction}
