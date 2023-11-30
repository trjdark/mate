/**
 * desc: 看板中部四个小看板组件
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/3/4
 * Time: 下午1:38
 */
import React, {Component} from 'react';
import {thousandNum} from '../common';

export class SecondPanel extends Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            leftTitle, leftValue, rightTitle, rightValue, bottomTitle, bottomValue, progress,
            handleLeftClick, handleRightClick, handleBottomClick,
        } = this.props;
        const progressValue = parseFloat(progress) || 0;
        return (
            <div className="page-wrap gym-dashboard-second-panel">
                <div className="gym-dashboard-second-panel-top">
                    <div className="gym-dashboard-second-panel-top-left">
                        <h6>{leftTitle}</h6>
                        {/*如果文字可点击，添加一个可点击的样式类，否则不添加，下同*/}
                        <p
                            className={handleLeftClick ? 'gym-dashboard-second-panel-emphasize' : undefined}
                            onClick={this.leftClick}
                        >
                            {thousandNum(leftValue)}
                        </p>
                    </div>
                    {
                        rightTitle ? (
                            <div className="gym-dashboard-second-panel-top-right">
                                <h6>{rightTitle}</h6>
                                <p
                                    className={handleRightClick ? 'gym-dashboard-second-panel-emphasize' : undefined}
                                    onClick={this.rightClick}
                                >
                                    {thousandNum(rightValue)}
                                </p>
                            </div>
                        ) : null
                    }
                </div>
                <div className="gym-dashboard-second-panel-bottom">
                    <h6>{bottomTitle}</h6>
                    <p
                        className={handleBottomClick ? 'gym-dashboard-second-panel-emphasize' : undefined}
                        onClick={this.bottomClick}
                    >
                        {thousandNum(bottomValue)}
                    </p>
                </div>
                {
                    (progress && progressValue > 0) ? (
                        <div className="gym-dashboard-second-panel-progress">
                            <div style={{width: progressValue > 100 ? '100%' : progress}}/>
                        </div>) : null
                }
            </div>
        )
    }

    /*左侧数字被点击*/
    leftClick = () => {
        const {handleLeftClick} = this.props;
        if (typeof handleLeftClick === 'function') {
            handleLeftClick();
        }
    };

    /*右侧数字被点击*/
    rightClick = () => {
        const {handleRightClick} = this.props;
        if (typeof handleRightClick === 'function') {
            handleRightClick();
        }
    };

    /*底部数字被点击*/
    bottomClick = () => {
        const {handleBottomClick} = this.props;
        if (typeof handleBottomClick === 'function') {
            handleBottomClick();
        }
    };
}
