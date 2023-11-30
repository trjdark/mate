/**
 * desc: 基础布局
 * User:
 * Date: 2018/7/30
 * Time: 下午6:14
 */

import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {Header} from "./header";
import {Sider} from "./sider";
import {connect} from "@/common/decorator/connect";
import {commonInit} from "@redux-actions/homeActions";
import {User} from "@/common/beans/user";
import {Scrollbars} from 'react-custom-scrollbars';
import {EarlyWarning} from "@/ui/containers/layout/earlyWarning";
import './style/index';
import {Crypto} from "@/common/utils/crypto";
import {selectBingGymIdMsgFlag} from "@/saga/selectors/home";
import {CommonUtils} from "@/common/utils/commonUtils";
import history from '@/router/history';
import {LogApi} from "@/api/logApi";
import {logError} from "@redux-actions/homeActions";

@connect((state) => ({
    bingGymboIdMsgFlag: selectBingGymIdMsgFlag(state)
}), {commonInit})
class Layout extends React.Component<any, any>{
    header:any;
    state = {
        scrollH: window.innerHeight,
        // visible: false
    };
    componentDidMount(){
        const node:any = ReactDOM.findDOMNode(this.header);
        const headerHeight = node.clientHeight;
        this.setState({
            scrollH: window.innerHeight - headerHeight,
        });
        this.props.commonInit({staffId: User.userId, currentCenterId: User.currentCenterId, centerId: User.currentCenterId});
        window.addEventListener('resize',this.onResize);
        window.addEventListener('unhandledrejection', this.getError);
        window.addEventListener('storage', function(e){
            const oldValue = JSON.parse(!!e.oldValue ? Crypto.decrypt(e.oldValue) : "{}");
            const newValue = JSON.parse(!!e.newValue ? Crypto.decrypt(e.newValue) : "{}");
            if(oldValue.currentCenterId && newValue.currentCenterId && oldValue.currentCenterId !== newValue.currentCenterId){
                window.location.href = location.protocol + '//' + location.host;
            }
        });
    }
    /**
     * 监听窗口大小变化
     */
    onResize = () => {
        const node:any = ReactDOM.findDOMNode(this.header);
        const headerHeight = node.clientHeight;
        this.setState({
            scrollH: window.innerHeight - headerHeight
        })
    };
    /**
     * 监听请求报错信息
     * @param err
     */
    getError = (err) => {
        // 预防log接口错误并重复提交
        if(err.reason.config.url.indexOf(LogApi.日志记录) > 0){
            return;
        }
        const {browser, system, version} = CommonUtils.getBrowserInfo();
        let type = err.reason.toString().indexOf('timeout') > 0 ? 'timeout' : 'promise';
        const desc = {
            browser, system, version,
            info: err.reason
        };
        const param = {
            userName: User.userName,
            token: User.getToken,
            centerCode: User.centerCode,
            uri: history.location.pathname,
            type: type,
            exception: JSON.stringify(desc)
        };
        logError(param)
    };
    componentWillUnmount(){
        window.removeEventListener('resize',this.onResize);
        window.removeEventListener('unhandledrejection',this.getError);
    }
    render(){
        const {scrollH,
        } = this.state;
        const permissionList = User.permissionList;
        return(
            <div id='gym-main' className='pos_rel'>
                <Header ref={(ref:any) => this.header = ref}/>
                <div className='gym-layout-content'>
                    <div className='gym-sider'>
                        <Scrollbars
                            autoHide={true}
                            universal={true}
                            autoHeightMin={scrollH}
                            autoHeightMax={scrollH}
                            autoHeight={true}
                        >
                            <Sider siderHeight={scrollH} permissionList={permissionList}/>
                        </Scrollbars>
                    </div>
                    {
                        User.permissionList.length > 0 &&
                            <Fragment>
                                <Scrollbars
                                    autoHide={true}
                                    universal={true}
                                    autoHeightMin={scrollH}
                                    autoHeightMax={scrollH}
                                    autoHeight={true}
                                    id="gym-content-wrap"
                                >
                                    <div className='gym-content'>
                                        {this.props.children}
                                    </div>
                                </Scrollbars>
                                <EarlyWarning/>
                            </Fragment>
                    }
                </div>
            </div>
    )
  }
}

export {Layout};
