/**
 * desc: 订货额度
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/7/4
 * Time: 上午10:38
 */
import React, {Component, Fragment} from 'react';
import {Link} from "react-router-dom";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Routes} from "@/router/enum/routes";
import {formatterMoney as formatter} from "@/ui/pages/report/common";
import {getOrderGoodsLimit} from "@redux-actions/report/pos";
import './style.scss';
import { CommonUtils } from '@/common/utils/commonUtils';
import {User} from "@/common/beans/user";
import {Divider} from 'antd';


interface OrderGoodsProps {
    [propName: string]: any
}

interface OrderGoodsState {
    arBalance: number | string,                 // 预付款余额
    centerTransfersDebt: number | string,       // 转课欠费
    emergencyQuota: number | string,            // 应急额度
    paymentMoney: number | string,              // 审批中订单
    preAr: number | string,                     // 未到期余额
    total: number | string,                     // 订货额度
    unshippedOrder: number | string,            // 未发货订单
    companyCode: number | string,               // 当前选项框渠道公司code
    currentCompanyCode: number | string,        // 查询数据时订货渠道code
    [propName: string]: any,
}

class OrderGoodsLimit extends Component<OrderGoodsProps, OrderGoodsState> {
    private breadCrumbRoutes = [
        {
            name: '报表'
        },
        {
            name: '中心管理'
        },
        {
            name: '订货额度'
        }
    ];

    private companyCodeList = {
        金宝贝商城: '3000',
        西格玛商城: '2050',
        default:  '3000',
    }

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            arBalance: 0,
            centerTransfersDebt: 0,
            emergencyQuota: 0,
            paymentMoney: 0,
            preAr: 0,
            total: 0,
            unshippedOrder: 0,
            companyCode: this.companyCodeList.default,
            currentCompanyCode: this.companyCodeList.default,
        }
        this.handleChange = this.handleChange.bind(this);
    }

    filterName = (code:string) => {
        const option = new Map([
            ['3000', '金宝贝商城'],
            ['2050', '西格玛商城'],
            ['default', '其他'],
        ]);
        return option.get(code) ? option.get(code) : option.get('default')
    }
    render(): React.ReactNode {
        const {data} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <div className="page-wrap order-limit-page-wrap">
                    <div className='text-c'>
                        <span className='c-error fontBold'>提示:</span>
                        <Link to={Routes.政策管理.path} className='cDefault'>
                            权益金相关政策，可以点击快速查看
                        </Link>
                    </div>
                    {
                        data.map((item, index) => (
                            <Fragment key={`company_${index}`}>
                                <div className='fontBold'>
                                    <span>订货渠道：</span><span>{this.filterName(item.companyCode)}</span>
                                </div>
                                <ul className="order-limit-list mb15">
                                    <li>
                                        <p>
                                            {
                                                item.companyCode === this.companyCodeList.金宝贝商城
                                                ? '金宝贝（中国）商贸有限公司AR：'
                                                : '上海劲跑教育科技有限公司AR'
                                            }
                                        </p>
                                        <p>
                                            <span>{formatter(item.arBalance)}</span>
                                            <a
                                                href={Routes.预付款余额.path}
                                                target="_blank"
                                                className="gym-button-xxs gym-button-white"
                                            >
                                                明细
                                            </a>
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            {
                                                item.companyCode === this.companyCodeList.金宝贝商城
                                                    ? '金宝贝（中国）商贸有限公司未到期余额：'
                                                    : '上海劲跑教育科技有限公司未到期余额：'
                                            }
                                        </p>
                                        <p>
                                            <span>{formatter(item.preAr)}</span>
                                            <a
                                                href={Routes.未到期权益金.path}
                                                target="_blank"
                                                className="gym-button-xxs gym-button-white"
                                            >
                                                明细
                                            </a>
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            {
                                                item.companyCode === this.companyCodeList.金宝贝商城
                                                    ? '金宝贝（中国）商贸有限公司未发货订单：'
                                                    : '上海劲跑教育科技有限公司未发货订单：'
                                            }
                                        </p>
                                        <p>
                                            <span>{formatter(item.unshippedOrder)}</span>
                                            <Link to={`${Routes.未发货订单.link}/${CommonUtils.stringify({companyCode:item.companyCode})}`}
                                                  target="_blank"
                                                  className="gym-button-xxs gym-button-white">
                                                明细
                                            </Link>
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            {
                                                item.companyCode === this.companyCodeList.金宝贝商城
                                                    ? '金宝贝（中国）商贸有限公司审核中订单：'
                                                    : '上海劲跑教育科技有限公司审核中订单：'
                                            }
                                        </p>
                                        <p><span>{formatter(item.paymentMoney)}</span></p>
                                    </li>
                                    <li>
                                        <p>
                                            {
                                                item.companyCode === this.companyCodeList.金宝贝商城
                                                    ? '金宝贝（中国）商贸有限公司应急额度：'
                                                    : '上海劲跑教育科技有限公司应急额度：'
                                            }
                                        </p>
                                        <p><span>{formatter(item.emergencyQuota)}</span></p>
                                    </li>
                                </ul>
                                <div className="order-limit-wrap mb30">
                                    <div>
                                        <p className="order-limit">订货额度：<span>{formatter(item.total)}</span></p>
                                        {item.companyCode === this.companyCodeList.金宝贝商城 && <p className="order-limit-des">订货额度=金宝贝（中国）商贸有限公司AR+金宝贝（中国）商贸有限公司未到期余额-金宝贝（中国）商贸有限公司未发货订单-金宝贝（中国）商贸有限公司审核中订单+金宝贝（中国）商贸有限公司应急额度</p>}
                                        {item.companyCode === this.companyCodeList.西格玛商城 && <p className="order-limit-des">订货额度=上海劲跑教育科技有限公司产品收入AR+上海劲跑教育科技有限公司产品收入未到期余额-上海劲跑教育科技有限公司未发货订单-上海劲跑教育科技有限公司审核中订单+上海劲跑教育科技有限公司应急额度</p>}
                                    </div>
                                </div>
                                {
                                    index === 0 && <Divider/>
                                }
                            </Fragment>
                        ))
                    }

                </div>
            </Fragment>
        )
    }

    componentDidMount(): void {
        this.getOrderGoodsLimitData()
    }

    /*获取订货额度数据*/
    getOrderGoodsLimitData = () => {
        const params = {
            centerCode: User.centerCode,
            };
        getOrderGoodsLimit(params).then(res => {
            this.setState({
                data:res
                // centerCode: companyCode
            });
        })
    }

    handleChange(data){
        this.setState({
            companyCode:data
        })
    }
}

export default OrderGoodsLimit;
