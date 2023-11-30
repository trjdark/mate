/**
 * Desc: 柱状图
 * User: Debby.Deng
 * Date: 2019/2/19,
 * Time: 2:15 PM
 */

import React from "react";
import {
    Chart,
    Geom,
    Tooltip,
    Label,
    Axis,
} from "bizcharts";
import {cloneDeep} from 'lodash';
import {DefaultDataContent} from "@/ui/component/defaultDataContent/defaultDataContent";

interface FunnelProps {
    xAxis?: string,                 // 横轴key
    yAxis?: string,                 // 纵轴key
    data: Array<any>,               // 数据
    toolTipLabel: string,          // toolTip的标记
    animate?: boolean,              // 是否展示动画
    color?: string | Array<string>, // 颜色
    height?: number,                // 高度
    hasTooltip?: boolean,           // 悬浮是否有提示
    [propName: string]: any
}

class Histogram extends React.Component<FunnelProps, any> {
    render() {
        let {
            animate = false,
            hasTooltip = true,
            toolTipLabel='',
            data,
            xAxis = 'name',
            yAxis = 'value',
            color = xAxis,
            height = 400,
            padding = [48, 60, 48, 80],
        } = this.props;

        const allDataZero = data.every(item => item.value === 0);   // 判断是否所有的数据都为0
        const sortData = cloneDeep(data).sort((a, b) => b.value - a.value);    // 根据value排序
        const maxValue = sortData.length > 0 ? sortData[0].value : 0;
        const cols = {
            [yAxis]: {tickInterval: maxValue <= 5 ? 1 : undefined}, // 当最大值小于5时，y轴间隔设置为1，其余按默认设置
        };

        return (
            <div>
                {
                    (data.length === 0 || allDataZero) ? (
                        <DefaultDataContent/>
                    ) : (
                        <Chart
                            height={height}
                            data={data}
                            scale={cols}
                            animate={animate}
                            forceFit={true}
                            padding={padding}
                        >
                            {
                                hasTooltip && (
                                    <Tooltip
                                        crosshairs={{type: 'y'}}
                                        itemTpl={
                                            '<li data-index={index}>'
                                            + '<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>'
                                            + `${toolTipLabel}`+': '+ '{value}'
                                            + '</li>'
                                        }
                                    />
                                )
                            }
                            <Axis name={xAxis}/>
                            <Axis name={yAxis}/>
                            <Geom
                                type="interval"
                                position={`${xAxis}*${yAxis}`}
                                color={Array.isArray(color) ? [xAxis, color] : color}
                            >
                                <Label
                                    content={
                                        [
                                            `${xAxis}*${yAxis}`,
                                            (x, y) => {
                                                return y;
                                            }
                                        ]
                                    }
                                    offset={15}
                                />
                            </Geom>
                        </Chart>
                    )
                }
            </div>
        );
    }
}

export {Histogram}
