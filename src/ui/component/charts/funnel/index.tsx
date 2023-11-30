/**
 * Desc: 漏斗图
 * User: Debby.Deng
 * Date: 2019/2/19,
 * Time: 10:34 AM
 */

import React, {Fragment} from "react";
import {
    Chart,
    Geom,
    Tooltip,
    Coord,
    Label,
    Legend,
    Guide,
} from "bizcharts";
import DataSet from "@antv/data-set";
import {DefaultDataContent} from "@/ui/component/defaultDataContent/defaultDataContent";

interface FunnelProps {
    xAxis?: string,                     // 横轴key
    y?: string,                     // 纵轴key
    data: Array<any>,               // 数据
    animate?: boolean,              // 是否展示动画
    color?: string | Array<string>, // 颜色
    height?: number,                // 高度
    padding?: any,
    hasLegend?: boolean,            // 是否有汇总栏
    hasTooltip?: boolean,           // 悬浮是否有提示
    hasGuide?: boolean              // 图表上文本
    [propName: string]: any,
}

class Funnel extends React.Component<FunnelProps, any> {
    render() {
        const {Text} = Guide;
        const {DataView} = DataSet;
        let {
            animate = false,
            hasLegend = false,
            hasTooltip = true,
            hasGuide = true,
            data,
            xAxis = 'x',
            yAxis = 'y',
            color = [],
            height = 250,
            padding = ['auto', 85, 'auto', 85]
        } = this.props;
        let dv = null;
        const allDataZero = data.every(item => item.value === 0);
        // 当数组为空或者值全为0时，不渲染图标，也不用预先计算数据
        if (!(data.length === 0 || allDataZero)) {
            dv = new DataView().source(data);
            dv.transform({
                type: 'map',
                callback: function callback(row, index) {
                    // 计算百分比，下一条数据与上一条数据对比, 如果下一条数据与上一条数据全部是0， 设置百分比为0
                    row.percent = (((row.value / data[index > 0 ? index - 1 : 0].value) || 0) * 100).toFixed(2) + '%';
                    return row;
                }
            });
            data = dv.rows;
        }
        return (
            <Fragment>
                {
                    (data.length === 0 || allDataZero) ? (
                        <DefaultDataContent/>
                    ) : (
                        <Chart
                            height={height}
                            data={data}
                            animate={animate}
                            padding={padding}
                        >
                            {hasTooltip && <Tooltip
                                showTitle={false}
                                itemTpl={`
                                    <li data-index={index} style="margin-bottom:4px;">
                                        <span style="background-color:{color};" class="g2-tooltip-marker">&nbsp;</span>{name}人数：<span>{value}</span><br/><span style="padding-left: 16px">占比：{percent}</span>
                                    </li>
                                `}
                            />}
                            <Coord type="rect" transpose={true} scale={[1, -1]}/>
                            {hasLegend && <Legend/>}
                            {
                                hasGuide && (
                                    <Guide>
                                        {data.map((obj, index) => {
                                            return (
                                                <Text
                                                    key={index}
                                                    top={true}
                                                    position={{
                                                        [xAxis]: obj[xAxis],
                                                        [yAxis]: data[0].value / 2      // 居中
                                                    }}
                                                    content={`${obj.name} ${obj.value}`}
                                                    style={{
                                                        fill: "#fff",
                                                        fontSize: "12",
                                                        textAlign: "center",
                                                        shadowBlur: 2,
                                                        shadowColor: "rgba(0, 0, 0, .45)",
                                                    }}
                                                />
                                            );
                                        })}
                                    </Guide>
                                )
                            }
                            <Geom
                                type="intervalSymmetric"
                                position={`${xAxis}*${yAxis}`}
                                shape="funnel"
                                color={color instanceof Array ? [xAxis, color] : color}
                                tooltip={[
                                    `${xAxis}*${yAxis}*percent`,
                                    (x, y, percent) => {
                                        return {
                                            name: x,
                                            percent: percent,
                                            value: y
                                        };
                                    }
                                ]}
                            >
                                <Label
                                    content={[
                                        'percent',
                                        percent => ` ${percent}`
                                    ]}
                                    offset={35}
                                    labelLine={{
                                        lineWidth: 1,
                                        stroke: "rgba(0, 0, 0, 0.15)"
                                    }}
                                />
                            </Geom>
                        </Chart>
                    )
                }
            </Fragment>
        );
    }
}

export {Funnel}
