/**
 * desc: 升班报告详情
 * User: Katarina.Yuan
 * Date: 2021/7/27
 * Time: 10:00
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PageTitle} from "@/ui/component/pageTitle";
import { Button } from "antd";
import { CommonUtils, SafeCalculate } from "@/common/utils/commonUtils";
import {
    promotionReportDetail,
    exportPromotionReportPreview,
    exportPromotionReport,
    sendPromotionReportToApp, promotionReportPreview
} from "@redux-actions/teaching/evaluationReport";
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Legend,
} from "bizcharts";
import { form } from "@/common/decorator/form";
import history from "@/router/history";
import DataSet from "@antv/data-set";
import { User } from '@/common/beans/user';
import moment from 'moment';
import { message } from 'antd/es';
import { PromotionReportTable } from './table'
import '../style/detail.scss'
import ReactToPrint from 'react-to-print';

@form()
class PromotionReportInfo extends React.Component<any, any> {
    babyId: string;
    courseCode: string; // 课程代码
    id: string;         // 后端返回的reportId
    printArea:any;
    private routes:Array<any> = [
        { name: '客户' },
        { name: '客户360' },
        { name: '客户成长' },
        { name: '升班报告' },
    ];
    constructor(props: any) {
        super(props);
        this.state = {
            babyInfo: {}, // 宝宝信息
            pushFlag: 0, // 同步启蒙开关 1为已同步，0为未同步，2为隐藏
            scoreRatio: [], // 蛛网图数据
            pixelRatio: window.devicePixelRatio * 4,
            levelContent: [],
            comments: [], // 报告摘要表格数据
        }
    }
    componentDidMount() {
        this.handleGetData()
    }
    // 请求数据
    handleGetData = (push?) => {
        // 预览
        this.courseCode = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).courseCode : '';
        this.babyId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).babyId : '';
        // 查询
        this.id = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).reportId : '';
        const params = {
            currentCenterId: User.currentCenterId,
            centerId: User.currentCenterId,
            babyId: this.babyId,
            courseCode: this.courseCode,
            id: this.id
        }
        // 只有查询有id值，预览没有id
        if (this.id) {
            promotionReportDetail(params).then((res:any) => {
                this.setState({
                                  babyInfo: res,
                                  scoreRatio: res.grades.map((item:any) => ({
                                      item: item.description,
                                      rate: Math.floor(SafeCalculate.mul(item.grade,100)),
                                  })),
                                  comments: res.comments,
                                  pushFlag: res.pushFlag
                              })
                this.handleTableData()
            })
        } else {
            promotionReportPreview(params).then((res:any) => {
                this.setState({
                                  babyInfo: res,
                                  scoreRatio: res.grades.map((item:any) => ({
                                      item: item.description,
                                      rate: Math.floor(SafeCalculate.mul(item.grade,100)),
                                  })),
                                  comments: res.comments,
                                  pushFlag: 2 // 预览没有App推送
                              })
                this.handleTableData()
            })
        }
    }
    // 处理报告摘要表格数据
    handleTableData = () => {
        // 需要排序
        let obj = {}
        const compare = function (obj1, obj2) {
            let val1 = obj1.item;
            let val2 = obj2.item;
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        }
        let commentsSort = this.state.comments.sort(compare)
        commentsSort.forEach(reportItem => {
            if (obj.hasOwnProperty(reportItem.item)) {
                obj[reportItem.item].push(reportItem)
            } else {
                obj[reportItem.item] = [reportItem]
            }
        })
        let arr = [];
        for(let x in obj) {
            if(obj[x]){
                arr.push([x,obj[x]])
            }
        }
        this.setState({
            comments: arr
        })
    }
    // 同步至app
    handleSendClick = () => {
        const params = {
            currentCenterId: User.currentCenterId,
            babyId: this.babyId,
            reviewReportId: this.id
        }
        // 推送启蒙强制刷新页面
        sendPromotionReportToApp(params).then(()=> {
            this.handleGetData()
            message.success('同步成功')
        })
    }
    /**
     * 返回上一页
     */
    goBackList = () => {
        history.go(-1)
    }
    /**
     * 分数详情按钮 报告导出
     */
    detailExport  = () => {
        if (this.courseCode) {
            // 预览导出
            const params = {
                currentCenterId: User.currentCenterId,
                centerId: User.currentCenterId,
                babyId: this.babyId,
                courseCode: this.courseCode
            }
            exportPromotionReportPreview(params)
        } else {
            // 查询导出
            const params = {
                currentCenterId: User.currentCenterId,
                centerId: User.currentCenterId,
                id: this.id
            }
            exportPromotionReport(params)
        }
    }
    render(){
        const { babyInfo, scoreRatio, pushFlag, comments} = this.state;
        const cols = {
            score: {
                min: 0,
                max: 100
            }

        };
        const label = {
            offset: 12,
            textStyle:{
                fill: '#009cbd',
                fontSize: '13',
                },
            formatter(text){
                return text.length>6?text.substring(0,5)+'\n'+text.substring(5):text
            }
        }
        const { DataView } = DataSet;
        const dv = new DataView().source(scoreRatio);
        dv.transform({
            type: "fold",
            fields: ["rate"],
            // 展开字段集
            key: "user",
            // key字段
            value: "score", // value字段
        });
        return(
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id="gym-promotion-detail" className="gym-promotion-detail page-wrap">
                    <div   ref={(el) => this.printArea = el}>
                        <div className='gym-promotion-detail-head'>
                            <div className='gym-promotion-detail-head-title'>
                                <span className='corange'>{babyInfo.level} 升班报告</span>
                            </div>
                            <div className='gym-promotion-detail-head-level'>
                                {
                                    babyInfo.reportTime &&
                                    <span>{moment(babyInfo.reportTime).format('YYYY-MM-DD')}</span>
                                }
                            </div>
                        </div>
                        <div className='gym-promotion-detail-info'>
                            <div className='gym-promotion-detail-info-item'>
                                <span className='gym-promotion-detail-info-item-label'>宝宝姓名：</span>
                                <span className='gym-promotion-detail-info-item-content'>{babyInfo.babyName}</span>
                            </div>
                            <div className='gym-promotion-detail-info-item'>
                                <span className='gym-promotion-detail-info-item-label'>月龄：</span>
                                <span className='gym-promotion-detail-info-item-content'>{babyInfo.babyMonth}</span>
                            </div>

                            <div className='gym-promotion-detail-info-item'>
                                <span className='gym-promotion-detail-info-item-label'>当前级别首课日期：</span>
                                <span className='gym-promotion-detail-info-item-content'>{moment(babyInfo.firstDate).format('YYYY-MM-DD')}</span>
                            </div>
                            <div className='gym-promotion-detail-info-item'>
                                <span className='gym-promotion-detail-info-item-label'>本级别出席次数：</span>
                                <span className='gym-promotion-detail-info-item-content'>{Math.floor(babyInfo.attendNum).toString()}</span>
                            </div>
                            <div className='gym-promotion-detail-info-item'>
                                <span className='gym-promotion-detail-info-item-label'>成长伙伴：</span>
                                <span className='gym-promotion-detail-info-item-content'>{babyInfo.gb||'-'}</span>
                            </div>
                            <div className='gym-promotion-detail-info-item'>
                                <span className='gym-promotion-detail-info-item-label'>成长顾问：</span>
                                <span className='gym-promotion-detail-info-item-content'>{babyInfo.ga||'-'}</span>
                            </div>
                        </div>
                        <PageTitle title='阶段总览'/>
                        <div className='gym-promotion-detail-chart'>
                            <Chart
                                data={dv}
                                padding={[20, 20, 95, 20]}
                                scale={cols}
                                forceFit={true}
                                height={450}
                                pixelRatio={this.state.pixelRatio}
                            >
                                <Coord type="polar" radius={0.8} />
                                <Axis
                                    name="item"
                                    line={null}
                                    tickLine={null}
                                    grid={{
                                        lineStyle: {
                                            lineDash: null
                                        },
                                        hideFirstLine: false
                                    }}
                                    label={label}
                                />
                                <Tooltip/>
                                <Axis
                                    name="score"
                                    line={null}
                                    tickLine={null}
                                    grid={{
                                        type: "polygon",
                                        lineStyle: {
                                            lineDash: null
                                        },
                                        alternateColor: "rgba(0, 0, 0, 0)"
                                    }}
                                />
                                <Legend name="user" marker="circle" />
                                <Geom type="area" position="item*score"  color={['user', ['#009cbd']]}/>
                                <Geom type="line" position="item*score"  color={['user', ['#009cbd']]} size={2} />
                                <Geom
                                    type="point"
                                    position="item*score"
                                    color="user"
                                    shape="circle"
                                    size={4}
                                    style={{
                                        stroke: "#fff",
                                        lineWidth: 1,
                                        fillOpacity: 0
                                    }}
                                />
                            </Chart>
                        </div>
                        <PageTitle title='报告摘要'/>

                        <div>
                            {
                                comments.map(item => <PromotionReportTable comments={item[1]} title={item[0]} key={Math.random()} />)
                            }
                        </div>
                        <div className="gym-promotion-detail-text">
                            如果爸爸妈妈对升班报告的内容有任何问题，请您联系中心的成长顾问了解详情哦！
                        </div>
                    </div>
                    <div className="gym-promotion-detail-left-btn">
                        <Button className="gym-button-white gym-button-sm gym-button-dashed gym-promotion-detail-left-btn-point" onClick={this.detailExport}>分数详情</Button>
                    </div>
                    <div className="gym-promotion-detail-btn">
                        <ReactToPrint
                            trigger={() => <a href="#"><Button className="gym-button-xs gym-button-blue">打印</Button></a>}
                            content={() => this.printArea}
                        />
                            <div className="gym-promotion-detail-btn-toApp" onClick={this.handleSendClick}>
                                {
                                    (() => {
                                        switch (pushFlag) {
                                            case 0:
                                                return (<button className="gym-button-default gym-button-sm">同步至启蒙APP</button>)
                                            case 1:
                                                return (<Button className="gym-button-default gym-button-lg" disabled={true}>已同步至启蒙APP</Button>)
                                            default:
                                                return null
                                        }
                                    })()
                                }
                            </div>
                        <Button className="gym-button-xs gym-button-white" onClick={this.goBackList}>返回</Button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export {PromotionReportInfo}
