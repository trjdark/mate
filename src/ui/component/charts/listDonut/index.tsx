/**
 * desc: 分面环状图
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/3/5
 * Time: 下午1:38
 */

import React, {Component, Fragment} from "react";
import {
    Chart,
    Facet,
} from "bizcharts";
import './index.scss';
import {DefaultDataContent} from "@/ui/component/defaultDataContent/defaultDataContent";

interface GuideObj {
    title: string,
    text: string,
}

interface DonutProps {
    data: Array<any>,                   // 环形图数据
    animate?: boolean,                  // 是否展示动画
    color?: Array<string>,     // 环形颜色
    height?: number,                    // 高度
    padding?: any,
    hasTooltip?: boolean,               // 悬浮是否有提示
    guide?: GuideObj                    // 环形图中间文本
}

export class ListDonut extends Component<DonutProps, any> {
    render() {
        const {
            data,
            animate = false,
            color,
            height = 250,
            padding = [0, 0, 0, 0],
        } = this.props;
        const allDataZero = data.every(item => item.value === 0);
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
                            forceFit={true}
                            padding={padding}
                        >
                            <Facet
                                type="list"
                                showTitle={false}
                                fields={['name']}
                                eachView={(view, facet) => {
                                    const {data, colIndex} = facet;
                                    data.push({
                                        name: '其他',
                                        value: 100 - data[0].value
                                    });
                                    view.source(data);
                                    view.coord('theta', {
                                        radius: 0.9,
                                        innerRadius: 0.65
                                    });
                                    view.intervalStack().position('value').color('name', [color[colIndex], '#eceef1']);
                                    view.guide().html({
                                        position: ['50%', '50%'],
                                        html: `
                                <div class="g2-guide-html">
                                    <p class="title">${data[0].name}</p>
                                    <p class="value">${data[0].value.toFixed(2)}%</p>
                                </div>
                                `
                                    });
                                }}
                            />
                        </Chart>
                    )
                }
            </Fragment>
        );
    }
}
