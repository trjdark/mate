/**
 * desc: 测评报告
 * User: Vicky
 * Date: 2020/8/17
 * Time: 10:40
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PageTitle} from "@/ui/component/pageTitle";
import { Checkbox, Button, Modal } from "antd";
import { CommonUtils } from "@/common/utils/commonUtils";
import {  editReportDetail, getReportRadar, sendToApp } from "@redux-actions/teaching/evaluationReport";
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Legend,
} from "bizcharts";
import { form } from "@/common/decorator/form";
import { Routes } from "@/router/enum/routes";
import history from "@/router/history";
import '../style/detail.scss';
import DataSet from "@antv/data-set";
import { User } from '@/common/beans/user';
import moment from 'moment';
import { Thumbnail } from "@/ui/component/thumbnail";
import { message } from 'antd/es';

@form()
class EvaluationLibarayInfo extends React.Component<any, any> {
    descOption: Map<string, string>;
    babyId: string;
    leadsId: string;
    id: string;
    private routes:Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching'
        },{
            name: '教学管理',
            path: '',
            link: '#',
            id: 'evaReportDetail'
        },
        {
            name: '到访测评',
            path: '',
            link: '#',
            id: 'evaluationReportDetail'
        },
    ];
    constructor(props: any) {
        super(props);
        this.descOption = new Map([
            ['3006001', '优势项'],
            ['3006002', '潜力项'],
            ['3006003', '待发展项'],
        ]);
        this.state = {
            babyInfo: {},
            pushTag: '',
            scoreRatio: [],
            pixelRatio: window.devicePixelRatio * 2,
            prewVisible: false, // 预览图
            levelContent: [],
        }
    }
    componentDidMount() {
        this.leadsId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).leadsId : '';
        this.babyId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).babyId : '';
        this.id = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).id : '';
        const params = {
            currentCenterId: User.currentCenterId,
            babyId: this.babyId,
            leadsId: this.leadsId,
            id: this.id
        }
        editReportDetail(params).then((res:any)=> {
            this.setState({ babyInfo: res, pushTag: res.pushTag})
        })
        getReportRadar(params).then((res:any) => {
            let map = {};
            let set = [];
            res.forEach((item) => {
                map[item.level]
                    ? map[item.level].push({ name: item.projectName, remark: item.remark })
                    : map[item.level] = [{ name: item.projectName, remark: item.remark }]
            });
            for (let key in map) {
                set.push({ level: key, levelName: this.descOption.get(key), list: map[key] })
            }
            this.setState({
                levelContent: set,
                scoreRatio: res.map((item:any) => ({
                    item: item.projectName,
                    rate: Math.round((item.targetNum / item.targetTotal) * 100)
                })),
            })
        })
    }
    // 同步至app
    handleSendClick = () => {
        const params = {
            currentCenterId: User.currentCenterId,
            babyId: this.babyId,
            leadsId: this.leadsId,
            id: this.id
        }
        sendToApp(params).then((res:any) => {
            message.success('同步成功')
            this.setState({ pushTag:0})
        },(err) => {
            message.error(err.msg);
        })
    }

    goBackList = () => {
        history.push(`${Routes.测评报告.path}`);
    }
    /**
     * 预览
     */
    showPreview = () => {
        this.setState({prewVisible: true});
    }
    onClosePreviewVisible = () =>{
        this.setState({prewVisible: false})
    }
    render(){
        const { babyInfo, scoreRatio, pushTag, prewVisible, levelContent=[]} = this.state;
        const cols = {
            score: {
                min: 0,
                max: 100
            }

        };
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
                <div id="gym-evaluation-detail" className="gym-evaluation-detail page-wrap">
                    <div className='gym-evaluation-detail-head'>
                        <div className='gym-evaluation-detail-head-title'>
                            <span className='corange'>测评报告</span>
                        </div>
                        <div className='gym-evaluation-detail-head-level'>
                            <span>{babyInfo.beginMonth}-{babyInfo.endMonth}个月</span>
                        </div>
                    </div>
                    <div className='gym-evaluation-detail-info'>
                        <div className='gym-evaluation-detail-info-item'>
                            <span className='gym-evaluation-detail-info-item-label'>宝宝姓名：</span>
                            <span className='gym-evaluation-detail-info-item-content'>{babyInfo.babyName}</span>
                        </div>
                        <div className='gym-evaluation-detail-info-item'>
                            <span className='gym-evaluation-detail-info-item-label'>性别：</span>
                            <span className='gym-evaluation-detail-info-item-content'>{babyInfo.gender}</span>
                        </div>
                        <div className='gym-evaluation-detail-info-item'>
                            <span className='gym-evaluation-detail-info-item-label'>月龄：</span>
                            <span className='gym-evaluation-detail-info-item-content'>{babyInfo.babyMonth}个月</span>
                        </div>
                        <div className='gym-evaluation-detail-info-item'>
                            <span className='gym-evaluation-detail-info-item-label'>测评日期：</span>
                            <span className='gym-evaluation-detail-info-item-content'>{moment(babyInfo.assessDate).format('YYYY-MM-DD')}</span>
                        </div>
                        <div className='gym-evaluation-detail-info-item'>
                            <span className='gym-evaluation-detail-info-item-label'>测评人：</span>
                            <span className='gym-evaluation-detail-info-item-content'>{babyInfo.assessStaff}</span>
                        </div>
                        <div className='gym-evaluation-detail-info-item'>
                            <span className='gym-evaluation-detail-info-item-label'>GB：</span>
                            <span className='gym-evaluation-detail-info-item-content'>{babyInfo.gbName||'-'}</span>
                        </div>
                    </div>
                    <div className='gym-evaluation-detail-photo'>
                        <PageTitle title='精彩瞬间'/>
                        {
                            (babyInfo.photoList || []).map((item:any,index:number) => (
                                <Thumbnail key={`thumb_${item.id}`} imgSrc={item.photoUrl} />

                            ))
                        }
                    </div>
                    <div className='gym-evaluation-detail-chart'>
                        <PageTitle title='测评结果总览'/>
                        <Chart
                            data={dv}
                            padding={[20, 20, 95, 20]}
                            scale={cols}
                            forceFit={true}
                            height={450}
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
                                label={{
                                    style: { fill: '#009CBD'}
                                }}
                            />
                            <Legend name="user" marker="circle" offset={30} />
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
                    <div className='gym-evaluation-detail-goal'>
                        <PageTitle title='达标统计'/>
                            <div className='gym-evaluation-detail-goal-table'>
                                <div className='gym-evaluation-detail-goal-table-head'>
                                    <div className="gym-evaluation-detail-goal-table-project-title right-left font-12" style={{ color: '#FFF' }}>项目</div>
                                    <div className="gym-evaluation-detail-goal-table-project-content-item-left right-one">测查项目</div>
                                    <div className="gym-evaluation-detail-goal-table-project-content-item-middle right-two">达成分解指标</div>
                                    <div className="gym-evaluation-detail-goal-table-project-content-item-right right-three">沟通要点</div>
                                </div>
                                {
                                    (babyInfo.projectList || []).map((projectItem, index:number) => (
                                        <div key={`projec_${index}`} className='gym-evaluation-detail-goal-table-project'>
                                            <div className='gym-evaluation-detail-goal-table-project-title'>
                                                {projectItem.projectName}
                                            </div>
                                            <div className='gym-evaluation-detail-goal-table-project-content'>
                                                {
                                                    (projectItem.itemList || []).map((item, itemIndex) => (
                                                        <div
                                                            key={`item_${itemIndex}`}
                                                            className='gym-evaluation-detail-goal-table-project-content-item'
                                                        >
                                                            <div
                                                                className='gym-evaluation-detail-goal-table-project-content-item-left'
                                                            >
                                                                {item.itemName}
                                                            </div>
                                                            <div
                                                                className='gym-evaluation-detail-goal-table-project-content-item-middle'
                                                            >
                                                                {
                                                                    (item.targetList || []).map((target, targetIndex) => (
                                                                        <div
                                                                            key={`target_${targetIndex}`}
                                                                            className='gym-evaluation-detail-goal-table-project-content-item-middle-target'
                                                                        >
                                                                            <span>{target.targetName}</span>
                                                                            <Checkbox
                                                                                className='gym-checkbox'
                                                                                checked={target.checked === 1 ? true : false}
                                                                            />
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                            <div
                                                                className='gym-evaluation-detail-goal-table-project-content-item-right'
                                                            >
                                                                {item.point}
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className='gym-evaluation-detail-record'>
                            <PageTitle title='测评记录（仅限员工查看）' />
                            <div className='gym-evaluation-detail-record-content'>{babyInfo.assessRecord||'-'}</div>
                        </div>
                        <div className="btn">
                            {babyInfo.isNew===1&&<Button className="gym-evaluation-detail-record-preview gym-button-default gym-button-sm" onClick={this.showPreview}>预览</Button>}
                            <div className="gym-evaluation-detail-toApp" onClick={this.handleSendClick}>
                                {
                                    pushTag === 1 ?
                                        <button className="gym-button-default gym-button-sm">同步至启蒙APP</button> :
                                        <Button className="gym-button-default gym-button-lg" disabled={true}>已同步至启蒙APP</Button>
                                }
                            </div>
                            <Button className="gym-button-default gym-button-sm gobackBtn" onClick={this.goBackList}>返回</Button>
                        </div>
                </div>
                <div className="gym-evaluation-detail-modal">
                    <Modal
                        visible={prewVisible}
                        width={800}
                        footer={false}
                        closable={false}
                        wrapClassName={`gym-evaluation-detail-wrapper-modal`}
                        onCancel={this.onClosePreviewVisible}
                    >
                        <div className="gym-evaluation-detail-modal-up">
                            <div className="gym-evaluation-detail-modal-name">{babyInfo.babyName}</div>
                            <div className='gym-evaluation-detail-modal-info'>
                                <div className='gym-evaluation-detail-modal-info-item'>
                                    <span className='gym-evaluation-detail-modal-info-item-label'>性别：</span>
                                    <span className='gym-evaluation-detail-modal-info-item-content'>{babyInfo.gender}</span>
                                </div>
                                <div className='gym-evaluation-detail-modal-info-item'>
                                    <span className='gym-evaluation-detail-modal-info-item-label'>出生日期：</span>
                                    <span className='gym-evaluation-detail-modal-info-item-content'>{moment(babyInfo.birthday).format('YYYY-MM-DD')}</span>
                                </div>
                                <div className='gym-evaluation-detail-modal-info-item'>
                                    <span className='gym-evaluation-detail-modal-info-item-label'>月龄：</span>
                                    <span className='gym-evaluation-detail-modal-info-item-content'>{babyInfo.babyMonth}个月</span>
                                </div>
                            </div>
                        </div>
                        <div className="gym-evaluation-detail-modal-title">金宝贝儿童成长测评报告</div>
                        <div>
                            <div className='gym-evaluation-detail-chart'>
                                <Chart
                                    data={dv}
                                    padding={[20, 20, 95, 20]}
                                    scale={cols}
                                    forceFit={true}
                                    height={450}
                                    style={{ color: '#FFF', stroke: '#FFF' }}
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
                                    />
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
                                        label={{
                                            style: { fill: '#009CBD'}
                                        }}
                                    />
                                    <Legend name="user" marker="circle" offset={30} />
                                    <Geom type="area" position="item*score" color={['user', ['#009cbd']]} />
                                    <Geom type="line" position="item*score" color={['user', ['#009cbd']]} size={2} />
                                    <Geom
                                        type="point"
                                        position="item*score"
                                        color="user"
                                        shape="circle"
                                        size={4}
                                        style={{
                                            stroke: "#fff",
                                            lineWidth: 1,
                                            fillOpacity: 0,
                                        }}
                                    />
                                </Chart>
                            </div>
                            <div className="gym-evaluation-detail-modal-level">
                                {
                                    (levelContent || []).map((item:any,index)=>(
                                        <div key={`project_${index}`}>
                                            <div className="gym-evaluation-detail-modal-level-sort dis">
                                                {item.levelName}
                                            </div>
                                            {
                                                (item.list || [] ).map((item2,index2)=>(
                                                    <div key={`detail_${index2}`}>
                                                        <div className="gym-evaluation-detail-modal-level-project dis">{item2.name}</div>
                                                        <div className="gym-evaluation-detail-modal-level-comment dis">{item2.remark}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </Modal>
                </div>
            </Fragment>
        )
    }
}

export {EvaluationLibarayInfo}
