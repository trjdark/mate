/**
 * desc: 中心课程包促销
 * Date: 2018/8/14
 * Time: 上午10:07
 */
import React from 'react';
import {PageTitle} from "../../../../component/pageTitle";
import {
    Form, Row, Col, Checkbox,
    DatePicker, InputNumber as AntdNumber
} from "antd";
import {InputNumber} from "@/ui/component/input";
import {DateInput} from "@/ui/component/datePicker";
import {form} from "../../../../../common/decorator/form";
import {CourseApplicationDateOption} from "../../enum/course";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {getCenterPackage} from "@redux-actions/setting/course";
import {
    updateCenterPackagePromotion,getCenterPackagePromotionHistoryList,
    addCenterPackagePromotion
} from "@redux-actions/setting/course";
import moment from 'moment';
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";
import {Message} from "@/ui/component/message/message";
import {CourseFrequency} from "@/ui/pages/setting/enum/course";
import {connect} from "@/common/decorator/connect";
import {selectBusinessSourceList} from "@/saga/selectors/home";

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

@connect((state) => ({
    businessSourceMap: selectBusinessSourceList(state)
}))

@form()

class CourseCenterPromotion extends React.Component<any, any> {
    packageId:string
    constructor(props:any){
        super(props)
        if(CommonUtils.hasParams(props)){
            this.packageId = CommonUtils.parse(props).id;
        }
        this.state = {
            packPromotionId: '',
            promotionBeginTime:null,
            promotionEndTime:null,
            freeValidityPeriod:null,
            freeCourseNum:null,
            actualPrice: null,

            pageNo: 1,
            pageSize: 10,
            centerPackage:{},
            dataSource: [],
            totalSize: 0,
        }
    }
    componentDidMount(){
        Promise.all([
            getCenterPackage({id: this.packageId, currentCenterId: User.currentCenterId}),
            getCenterPackagePromotionHistoryList({
                currentCenterId: User.currentCenterId,
                packageId: this.packageId,
                pageNo: this.state.pageNo,
                pageSize: this.state.pageSize
            })
        ]).then((res:any) => {
            this.setState({
                centerPackage: res[0],
                dataSource: res[1].list,
                totalSize: res[1].totalSize
            })
        })
    }
    /**
     * 提交
     * @param e
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                const begin=values.promotionBeginTime && values.promotionBeginTime.startOf('day').valueOf();
                const end=values.promotionEndTime && values.promotionEndTime.startOf('day').valueOf();
                if(!begin){
                    Message.error('请输入促销起始日！');
                    return;
                }
                if(!end){
                    Message.error('请输入促销截止日！');
                    return;
                }
                if(begin-end>0){
                    Message.error(`促销截止日必须大于等于促销起始日!`);
                    return;
                }
                values.promotionBeginTime = begin;
                values.promotionEndTime = end;
                const body = Object.assign({}, values, {
                    packageId: this.packageId,
                    currentCenterId: User.currentCenterId,
                    pageNo: this.state.pageNo,
                    pageSize: this.state.pageSize
                });
                this.addPromotion(body);
            }
        })
    };
    /**
     * 翻页逻辑
     * @param date
     */
    handleChangePage = (pageInfo:any) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
        }, this.getHistoryList)
    }
    /**
     * 修改起始日
     * @param date
     */
    onChangeStart = (date) => {
        this.setState({
            promotionBeginTime: +date.startOf('day')
        });
    };
    /**
     * 修改截止日
     * @param date
     */
    onChangeEnd = (date) => {
        this.setState({
            promotionEndTime: +date.startOf('day')
        });
    };
    /**
     * 修改赠送课时数
     */
    onChangeNum = (data:number) => {
        this.setState({
            freeCourseNum: data
        });
    };
    /**
     * 修改赠送有效期
     */
    onChangePeriod = (data:number) => {
        this.setState({
            freeValidityPeriod: data
        });
    };
    /**
     * 修改课程包促销定价
     */
    onChangeActualPrice = (data:number) => {
        this.setState({
            actualPrice: data
        });
    };
    editPromotion = (record:any) => {
        this.setState({
            packPromotionId: record.id,
            promotionBeginTime: record.promotionBeginTime,
            promotionEndTime:record.promotionEndTime,
            freeValidityPeriod:record.freeValidityPeriod,
            freeCourseNum:record.freeCourseNum,
            actualPrice:record.actualPrice
        });
    }
    savePromotion = (record:any) => {
        const {promotionBeginTime,promotionEndTime}=this.state;
        if(promotionBeginTime>promotionEndTime){
            Message.error(`促销截止日必须大于等于促销起始日!`);
            return;
        }
        this.updatePromotion(Object.assign({}, this.state, {
            id: record.id,
            packageId: this.packageId,
            currentCenterId: User.currentCenterId,
            pager:null
        }))
    };
    cancelPromotion = () => {
        this.setState({
            packPromotionId: '',
            promotionBeginTime:null,
            promotionEndTime:null,
            freeValidityPeriod:null,
            freeCourseNum:null,
            actualPrice:null
        });
    };
    /**
     * 添加促销
     * @param params
     */
    addPromotion = (params:any) => {
        addCenterPackagePromotion(params).then(() => {
            Message.success('添加成功！');
            this.cancelPromotion();
            this.getHistoryList();
        });
    };
    /**
     * 修改促销
     * @param params
     */
    updatePromotion = (params:any) => {
        updateCenterPackagePromotion(params).then(() => {
            Message.success('更新成功！');
            this.cancelPromotion();
            this.getHistoryList();
        });

    };
    /**
     * 获取促销历史记录
     */
    getHistoryList = () => {
        getCenterPackagePromotionHistoryList({
            currentCenterId: User.currentCenterId,
            packageId: this.packageId,
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize
        }).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    };
    /**
     * 修改
     * @param record
     * @returns {boolean}
     */
    isEditing = (record) => {
        return record.id === this.state.packPromotionId;
    };
    // 表头配置
    columns = [{
        title: '状态',
        dataIndex: 'status',
        key: 'type',
        render:((text:string, record:any) =>
                record.isNow === 'true' ? <div>当前</div> : null
        )
    }, {
        title: '促销起始日',
        dataIndex: 'promotionBeginTime',
        key: 'promotionBeginTime',
        render: (date:number, record:any) => {
            const editable = this.isEditing(record);
            return(
                <div>
                    {
                        editable
                            ? <DatePicker
                                onChange={this.onChangeStart}
                                defaultValue={moment(this.state.promotionBeginTime)}
                            />
                            : <span>{moment(date).format('YYYY-MM-DD')}</span>
                    }
                </div>
            )
        }
    }, {
        title: '促销截止日',
        dataIndex: 'promotionEndTime',
        key: 'promotionEndTime',
        render: (date:number, record:any) => {
            const editable = this.isEditing(record);
            return(
                <div>
                    {
                        editable
                            ? <DatePicker
                                onChange={this.onChangeEnd}
                                defaultValue={moment(this.state.promotionEndTime)}/>
                            : <span>{moment(date).format('YYYY-MM-DD')}</span>
                    }
                </div>
            )
        }
    }, {
        title: '赠送课时数',
        dataIndex: 'freeCourseNum',
        key: 'freeCount',
        render: (text:string, record:any) => {
            const editable = this.isEditing(record);
            return(
                <div>
                    {
                        editable
                            ? <AntdNumber precision={0}
                                           min={0} defaultValue={this.state.freeCourseNum} onChange={this.onChangeNum}/>
                            : <span>{text}</span>
                    }
                </div>
            )
        }
    },{
        title: '赠送有效期',
        dataIndex: 'freeValidityPeriod',
        key: 'freeValidityPeriod',
        render: (text:string, record:any) => {
            const editable = this.isEditing(record);
            return(
                <div>
                    {
                        editable
                            ? <div>
                                <AntdNumber precision={0}
                                            min={0} defaultValue={this.state.freeValidityPeriod} onChange={this.onChangePeriod}/>
                                <span>个月</span>
                            </div>
                            : <span>{text}个月</span>
                    }
                </div>
            )
        }
    },{
        title: '课程包促销定价',
        dataIndex: 'actualPrice',
        key: 'actualPrice',
        render: (text:number, record:any) => {
            const editable = this.isEditing(record);
            return(
                <div>
                    {
                        editable
                            ? <div>
                                <AntdNumber precision={2}
                                             min={0} defaultValue={this.state.actualPrice} onChange={this.onChangeActualPrice}/>
                            </div>
                            : <span>{CommonUtils.toThousands(text)}</span>
                    }
                </div>
            )
        }
    }, {
        title: '操作',
        dataIndex: 'action',
        render:(text:string, record:any) => {
            const editable = this.isEditing(record);
            return (
                <div>
                    {
                        editable
                            ? <div>
                                <button className='gym-button-xxs gym-button-white mr5' onClick={() => this.savePromotion(record)}>保存</button>
                                <button className='gym-button-xxs gym-button-white' onClick={() => this.cancelPromotion()}>取消</button>
                            </div>
                            : <button className='gym-button-xxs gym-button-white' onClick={() => this.editPromotion(record)}>修改</button>
                    }
                </div>
            )
        }
    }];
    render(){
        const {businessSourceMap} = this.props;
        const {pageNo, pageSize, centerPackage, totalSize, dataSource} = this.state;
        const workDay = CourseApplicationDateOption
            .filter((item:any) => centerPackage[item.value] === 1)
            .map((item:any) => item.value);
        const formStyle = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        };
        const formOneStyle = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
        };
        const {getFieldDecorator} = this.props.form;
        return(
            <div className='gym-center-course-promotion'>
                <Form onSubmit={this.handleSubmit}>
                    <PageTitle title='课程包基本资料'/>
                    <div>
                        <Row>
                            <Col span={10}>
                                <FormItem label='课程包代码' {...formStyle}>
                                    <span>{centerPackage.packageCode}</span>
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem label='课程包名称' {...formStyle} >
                                    <span>{centerPackage.packageName}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <FormItem label={`课程包类型`}  {...formStyle}>
                                    <span>{centerPackage.packageType === 1 ? '课次产品' : '时段产品'}</span>
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem label={`启用状态`} {...formStyle}>
                                    <span>
                                        {
                                            centerPackage.isEnabled === 1
                                                ? '启用'
                                                :centerPackage.isEnabled === 0
                                                ? '禁用'
                                                : null
                                        }
                                    </span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <FormItem label={`固定合约频次`} {...formStyle} >
                                    <span>{
                                        centerPackage.isUpperOrLower !== undefined
                                            ? CourseFrequency.filter((item) => item.value === centerPackage.isUpperOrLower)[0].name
                                            : null
                                    }</span>
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem label={`合约频次`} {...formStyle} >
                                    <span>{centerPackage.nc}次/周</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <FormItem label={`有效期单位`} {...formStyle} >
                                    <span>月</span>
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem label={`标准有效期长度`} {...formStyle} >
                                    <span>{centerPackage.validityPeriod}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <FormItem label={`课时数`} {...formStyle} >
                                    <span>{centerPackage.packageNum}课时</span>
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem label={`标准请假次数`} {...formStyle} >
                                    <span>{centerPackage.leaveTimes}次数</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <FormItem label={`课程业务来源`} {...formStyle}>
                                    <span>{
                                        centerPackage.businessSource
                                            ? businessSourceMap.filter((item) => item.businessSourceCode === centerPackage.businessSource)[0].businessSourceValue
                                            : null
                                    }
                                    </span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <FormItem label={`适用日`} {...formOneStyle}>
                                <CheckboxGroup
                                    disabled
                                    options={CourseApplicationDateOption}
                                    value={workDay ? workDay : undefined}
                                />
                            </FormItem>
                        </Row>
                    </div>
                    <PageTitle title='中心课程包促销' className='gym-setting-page-title'/>
                    <Row>
                        <Col span={10}>
                            <FormItem label='赠送课时' {...formStyle}>
                                {
                                    getFieldDecorator('freeCourseNum',{
                                      rules: [{ required: true, message: '请输入赠送课时'}]
                                    })(
                                        <InputNumber precision={0}
                                                     min={0} placeholder={`赠送课时`} />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem label={`赠送有效期`} {...formStyle}>
                                {
                                    getFieldDecorator('freeValidityPeriod',{
                                      rules: [{ required: true, message: '请输入赠送有效期'}]
                                    })(
                                        <InputNumber precision={0}
                                                     min={0}/>
                                    )
                                }
                                <span className='gym-unit'>个月</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <FormItem label={`课程包促销定价`} {...formStyle}>
                                {
                                    getFieldDecorator('actualPrice',{
                                      rules: [{ required: true, message: '请输入课程包促销定价'}]
                                    })(
                                        <InputNumber precision={0}
                                                     min={0}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <FormItem label={`促销起始日`} {...formStyle}>
                                {
                                    getFieldDecorator('promotionBeginTime',{
                                      rules: [{ required: true, message: '请输入促销起始日'}]
                                    })(
                                        <DateInput />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem label={`促销截止日`} {...formStyle}>
                                {
                                    getFieldDecorator('promotionEndTime',{
                                      rules: [{ required: true, message: '请输入促销截止日'}]
                                    })(
                                        <DateInput />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2} className="add">
                            {
                                centerPackage.packageType === 1
                                    ? <button className="gym-button-xs gym-button-default">添加</button>
                                    : <button disabled className="gym-button-xs gym-button-greyb">添加</button>
                            }
                        </Col>
                    </Row>
                </Form>
                <PageTitle title='中心课程包促销历史' className='gym-setting-page-title'/>
                <TablePagination
                    columns={this.columns}
                    rowKey={'id'}
                    dataSource={dataSource}
                    totalSize={totalSize}
                    pageSize={pageSize}
                    handleChangePage={this.handleChangePage}
                    pageNo={pageNo}
                />
            </div>
        )
    }
}

export {CourseCenterPromotion}
