/**
 * desc: 404错误页面
 * Date: 2018/7/30
 * Time: 下午6:12
 */
import React, {Component} from 'react';
import './sytle/404.scss';

class Err404 extends Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="not-find-wrap">
                <div className="not-find">
                    <div className="not-find-content">
                        <img src={require("./images/404.png")} alt="404图片"/>
                        <p className="not-find-tips">出错啦！一不小心闯进了未知领域，您可以选择下方按钮进行操作</p>
                        <a
                            href="javascript:void(0)"
                            className="go-home-btn"
                            onClick={this.goHome}
                        >
                            返回首页
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    goHome = () => {
        this.props.history.push('/');
    }
}

export {Err404}
