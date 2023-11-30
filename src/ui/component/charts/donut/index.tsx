/**
 * Desc: 环形图
 * User: Debby.Deng
 * Date: 2019/2/18,
 * Time: 1:54 PM
 */
import React, {Component} from "react";
import {
    Chart,
    Geom,
    Tooltip,
    Coord,
    Label,
    Guide,
} from "bizcharts";
import DataSet from "@antv/data-set";
import './index.scss';
import {DefaultDataContent} from "@/ui/component/defaultDataContent/defaultDataContent";

// 结构出二级组件
const {Html} = Guide;
const {DataView} = DataSet;

interface GuideObj {
    title: string,
    text: string,
}

interface DonutProps {
    data: Array<any>,                   // 环形图数据
    xAxis?: string,                     // 横轴key
    yAxis?: string,                     // 纵轴key
    animate?: boolean,                  // 是否展示动画
    color?: string | Array<string>,     // 环形颜色
    height?: number,                    // 高度
    padding?: any,
    hasTooltip?: boolean,               // 悬浮是否有提示
    guide?: GuideObj                    // 环形图中间文本
    hasLabelLine?: boolean,             // 是否有lable文本离图形之间的线
}

// Chart组件的scale配置
const scaleSetting = {
    percent: {
        formatter: val => {
            return (val * 100).toFixed(2) + "%";
        }
    }
};

class Donut extends Component<DonutProps, any> {
    render() {
        const {
            data,
            animate = false,
            hasTooltip = true,
            hasLabelLine = false,
            xAxis = 'name',
            yAxis = 'value',
            color,
            height = 250,
            guide = {title: '', text: ''},
            padding = [0, 0, 0, 0],
        } = this.props;

        let dv = null;

        const {title, text} = guide;
        const numArr = String(text).split('.');
        const allDataZero = data.every(item => item.value === 0);

        // 当数组为空或者值全为0时，不渲染图标，也不用预先计算数据
        if (!(data.length === 0 || allDataZero)) {
            dv = new DataView().source(data).transform({
                type: "percent",
                field: yAxis,
                dimension: xAxis,
                as: "percent"
            });
        }
        return (
            (data.length === 0 || allDataZero) ? (
                <DefaultDataContent/>
            ) : (
                <Chart
                    height={height}
                    data={dv}
                    scale={scaleSetting}
                    animate={animate}
                    forceFit={true}
                    padding={padding}
                >
                    <Coord type="theta" radius={1} innerRadius={0.65}/>
                    <Geom
                        type="intervalStack"
                        position="percent"
                        color={Array.isArray(color) ? [xAxis, color] : color}
                        select={false}
                    >
                        <Label
                            content="percent"
                            htmlTemplate={(val, item) => {
                                const {point, color} = item;
                                let {percent} = point;
                                percent = (percent * 100).toFixed(2) + '%';
                                return (`
                                    <p class="gym-charts-donut">
                                        <span style="background-color: ${color};" class="gym-charts-donut-circle">&nbsp;</span>
                                        <span>${point[xAxis]}:${percent}</span>
                                    </p>
                                `)
                            }}
                            labelLine={{lineWidth: hasLabelLine ? 1 : 0}}
                        />
                    </Geom>
                    {
                        hasTooltip && (<Tooltip showTitle={false}/>
                        )
                    }
                    {
                        guide.title && (
                            <Guide>
                                <Html
                                    position={["50%", "50%"]}
                                    html={
                                        `
                                        <div class="gym-charts-donut-guide">
                                            <p class="gym-charts-donut-guide-title">${title}</p>
                                            <p class="gym-charts-donut-guide-number">
                                                <span>${numArr[0]}</span>
                                                <span>${numArr[1] ? `.${numArr[1]}` : ''}</span>
                                            </p>
                                        </div>
                                        `
                                    }
                                    alignX="middle"
                                    alignY="middle"
                                />
                            </Guide>
                        )
                    }
                </Chart>
            )
        );
    }
}

export {Donut}
