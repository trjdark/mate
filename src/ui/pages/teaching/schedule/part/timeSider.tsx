/**
 * Desc: 课程表左侧时间栏
 * User: Debby.Deng
 * Date: 2018/12/3,
 * Time: 上午11:32
 */
import * as React from "react";
import timeLine from "../../enum/schedule";

interface PropSet {
    timeHeight?: 'regular' | 'autoSize',// regular:固定高度，autoSisze:自动拉伸高度
    hArr?: Array<string>,// 如果随表格拉伸高度，各行高度数组
}

class TimeSider extends React.Component<PropSet> {
    /**
     * 签到列表sider高度重新计算
     * @returns Array
     */
    getHeight = () => {
        const {hArr} = this.props;
        return (hArr || []).map((height, index) => {
            return {
                name: timeLine[index],
                height: height || 31,
            }
        });
    };

    render() {
        const {timeHeight} = this.props;
        let heightArr = [];
        if (timeHeight === 'autoSize') {
            heightArr = this.getHeight();
        }
        return (
            <ul className='gym-time-sider'>
                {
                    heightArr.length ?
                        heightArr.map((item, index) => (
                            <li
                                key={index}
                                style={{height: item.height + "px", lineHeight: item.height + 'px'}}
                            >
                                {item.name}
                            </li>
                        )) :
                        timeLine.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                }
            </ul>
        )
    }
}

export {TimeSider}
