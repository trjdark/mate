/**
 * desc: 错误监听
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/11/14
 * Time: 下午2:56
 */
import React from 'react';
import {CommonUtils} from "@/common/utils/commonUtils";
import {User} from "@/common/beans/user";
import history from "@/router/history";
import {logError} from "@redux-actions/homeActions";
import './index.scss';

class ErrorBoundary extends React.Component<any, any> {
    constructor(props){
        super(props);
        this.state = {
            error: null
        }
    }
    static getDerivedStateFromError(error) {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        console.info('getDerivedStateFromError...', error)
        return { error }
    }
    componentDidCatch(error, errorInfo) {
        const {browser, system, version} = CommonUtils.getBrowserInfo();
        const desc = {
            browser, system, version,
            info: error.toString()
        };
        const param = {
            userName: User.userName,
            token: User.getToken,
            centerCode: User.centerCode,
            uri: history.location.pathname,
            type: 'render',
            exception: JSON.stringify(desc)
        };
        this.setState({error: error})
        logError(param)
        console.info('componentDidCatch...', error, errorInfo);
    }
    goHome = () => {
        this.props.history.push('/');
    }
    render () {
        if(this.state.error) {
            return (
                <div className="error-page-wrap">
                    <div className="error-page">
                        <img src={require('../../../images/error.png')} alt="500错误图片"/>
                        <p className="error-tips">抱歉，页面出错了，运维人员正在抢修</p>
                        <a
                            href="javascript:void(0)"
                            className="go-home-btn"
                            onClick={this.goHome}
                        >
                            返回首页
                        </a>
                    </div>
                </div>
            )
        }
        return this.props.children;
    }
}

export {ErrorBoundary}
