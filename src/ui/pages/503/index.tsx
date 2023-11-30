/**
 * desc: 503错误页面
 * Date: 2018/7/30
 * Time: 下午6:12
 */
import React from 'react';
import './style/index.scss'

class Err503 extends React.Component<any, any> {
    render() {
        return (
            <div className="error-page-wrap">
                <div className="error-page">
                    <img src={require('./images/error.png')} alt="500错误图片"/>
                    <p className="error-tips">抱歉，服务器出错了，运维人员正在抢修</p>
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

    goHome = () => {
        this.props.history.push('/');
    }
}

export {Err503}
