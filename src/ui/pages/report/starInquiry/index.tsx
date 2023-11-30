/**
 * desc: 星级查询
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/7/4
 * Time: 上午10:38
 */
import React, {Component, Fragment} from 'react';
import {Rate} from "antd";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Polyline} from "@/ui/component/charts/polyline";
import {getStar} from "@redux-actions/report/pos";
import './style.scss';

class StarInquiry extends Component<any, any> {
    private breadCrumbRoutes = [
        {
            name: '报表'
        },
        {
            name: '中心查询'
        },
        {
            name: '星级评分'
        }
    ];

    constructor(props) {
        super(props);
        this.state = {
            star: 0,
            data: [],
            currDate:''
        }
    }

    render(): React.ReactNode {
        const {data, star,currDate} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <div className="page-wrap order-limit-page-wrap">
                    <div className="order-limit-wrap">
                        <div>
                            <div className="order-limit">
                                当前星级：
                                <Rate className="star-num" disabled={true} value={star}/>
                            </div>
                            <p className="order-limit-des">评估时间: {currDate}</p>
                        </div>
                    </div>
                    <div className="star-num-chart">
                        <h3>星级</h3>
                        {
                            data.length>0?
                                <Polyline data={data}/> :
                                <p className='text-c'>暂无数据</p>
                        }
                    </div>
                </div>
            </Fragment>
        )
    }

    componentDidMount(): void {
        this.getStarDetail();
    }

    /* 获取星级数据 */
    getStarDetail = () => {
        getStar().then(res => {
            const {star, starDatas,currDate} = res;
            this.setState({
                star,
                data: starDatas||[],
                currDate
            })
        });
    }
}

export default StarInquiry;
