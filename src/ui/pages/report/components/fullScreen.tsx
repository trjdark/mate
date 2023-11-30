/**
 * desc: 全屏查看组件
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/10
 * Time: 上午10:38
 */

import React, {Component} from 'react';
import {Icon} from "@/ui/component/icon";
import {Button} from "antd";
import moment from "moment";

class FullScreen extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            fullScreen: false,  // 是否全屏显示，默认不全屏
        }
    }

    render() {
        const {fullScreen} = this.state;
        const {lastSyncDatetime, handleDownLoadExcel, canDownload, fyi} = this.props;
        return (
            <div className={`gym-report-fullscreen ${fullScreen ? 'gym-report-fullscreen-active' : ''}`}>
                <div className="gym-report-result-export">
                    <div>
                        <button
                            className={`gym-button-sm ${canDownload ? 'gym-button-default' : 'gym-button-greyb'}`}
                            onClick={handleDownLoadExcel}
                            disabled={canDownload?false: true}
                        >
                            导出
                        </button>
                        <Button
                            // type="primary"
                            className="gym-report-fullscreen-switch-btn gym-button-sm gym-button-blue"
                            onClick={this.handleSwitchFullScreen}
                        >
                            <Icon type='quanping'/>
                            <span>{fullScreen ? '退出全屏' : '全屏'}</span>
                        </Button>

                    </div>
                    {
                        lastSyncDatetime ? (
                            <span><span>{fyi?fyi:''}</span>数据更新时间: {moment(lastSyncDatetime).format('YYYY-MM-DD HH:mm')}</span>
                        ) : null
                    }
                </div>
                {this.props.children}
            </div>
        )
    }

    handleSwitchFullScreen = () => {
        this.setState((prevState) => {
            return {
                fullScreen: !prevState.fullScreen
            }
        })
    }
}

export default FullScreen;
