import React, {Component} from "react";
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
} from "bizcharts";

interface DataItem {
    year: string,
    value: number,
}

interface PolylineProps {
    data: DataItem[],
    color?: string,
}

class Polyline extends Component<PolylineProps, any> {
    constructor(props) {
        super(props);
    }

    render() {
        const cols = {
            value: {
                min: 0
            },
            year: {
                formatter:(val)=>(val.split('.')[0]+'年')
            }
        };

        const {data = [], color = '#009CBD'} = this.props;
        return (
            <Chart height={400} data={data} scale={cols} forceFit={true}>
                <Axis name="year"/>
                <Axis name="value"/>
                <Tooltip
                    crosshairs={{type: "y"}}
                />
                <Geom
                    type="line"
                    position="year*value"
                    size={1}
                    color={color}
                    tooltip={['year*value', (year, value) => {
                        const yearArr=year.split('.');
                        return {
                            // 自定义 tooltip 上显示的 title 显示内容等。
                            name: '星级',
                            title: yearArr[0] + '年'+ yearArr[1]+"月",
                            value: value+"星"
                        };
                    }]}
                />
                <Geom
                    type="point"
                    position="year*value"
                    size={5}
                    shape={"circle"}
                    color={color}
                    style={{
                        stroke: "#fff",
                        lineWidth: 1
                    }}
                    tooltip={['year*value', (year, value) => {
                        const yearArr=year.split('.');
                        return {
                            // 自定义 tooltip 上显示的 title 显示内容等。
                            name: '星级',
                            title: yearArr[0] + '年'+ yearArr[1]+"月",
                            value: value+"星"
                        };
                    }]}
                />
            </Chart>
        );
    }
}

export {Polyline}
