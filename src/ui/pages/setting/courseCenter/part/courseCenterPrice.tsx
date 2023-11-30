/**
 * desc: 中心课程包定价
 * Date: 2018/8/14
 * Time: 上午10:07
 */
import React from 'react';
import {PageTitle} from "@/ui/component/pageTitle";
import {
    Form, Row, Col, Checkbox,
    DatePicker, Button, InputNumber as AntdNumber
} from "antd";
import {InputNumber} from "@/ui/component/input";
import {CommonUtils} from "@/common/utils/commonUtils";
import {form} from "@/common/decorator/form";
import {
    getCenterPackage, updateCenterPackagePrice, getCenterPackagePriceHistoryList,
    addCenterPackagePrice
} from "@redux-actions/setting/course";
import {CourseApplicationDateOption} from "../../enum/course";
import moment from 'moment';
import {User} from "@/common/beans/user";
import {TablePagination} from "@/ui/component/tablePagination";
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

class CourseCenterPrice extends React.Component<any, any> {
    packageId:string;
    constructor(props:any){
        super(props);
        if(CommonUtils.hasParams(props)){
            this.packageId = CommonUtils.parse(props).id;
        }
        this.state = {
            packPriceId: '',
            effectiveTime:null,
            endTime:null,
            leaveTimes:null,
            baseUnitPrice:null,
            packagePrice:null,
            allowAbsenceTimes: null,
            centerPackage: {},                  // 课程包信息
            pageNo: 1,                          // 当前页
            pageSize: 10,                       // 页数
            dataSource: [],                     // 定价历史数据
            totalSize: 0,                       // 定价历史数据总数
        }
    }
    componentDidMount(){
        Promise.all([
            getCenterPackage({id: this.packageId, currentCenterId:User.currentCenterId}),
            getCenterPackagePriceHistoryList({
                currentCenterId: User.currentCenterId,
                packageId:this.packageId,
                pageNo:this.state.pageNo,
                pageSize:this.state.pageSize
            }),
        ]).then((res:any) => {
            this.setState({
                centerPackage: res[0],
                dataSource: res[1].list,
                totalSize: res[1].totalSize
            })
        });
    }
    onChangeBaseUnitPrice = (date:any) => {
        let {form}=this.props;
        let {centerPackage}=this.state;
        form.setFieldsValue({'packagePrice':Math.floor(date*centerPackage.packageNum)})
    };

    onChangePackagePrice = (date:any) => {
        let {form}=this.props;
        let {centerPackage}=this.state;
        form.setFieldsValue({'baseUnitPrice':( date / centerPackage.packageNum)})
    };
    /**
     * 获取历史记录
     */
    getHistoryList = () => {
        getCenterPackagePriceHistoryList({
            currentCenterId: User.currentCenterId,
            packageId:this.packageId,
            pageNo:this.state.pageNo,
            pageSize:this.state.pageSize
        }).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    }
    /**
     * 添加定价历史
     * @param e
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err,values) => {
            if(!err){
                const begin = values.effectiveTime && values.effectiveTime.startOf('day').valueOf();
                const end = values.endTime && values.endTime.startOf('day').valueOf();
                if(begin-end>0){
                    Message.error(`定价截止日必须大于等于定价起始日!`);
                    return;
                }
                values.effectiveTime = begin;
                values.endTime = end;
                this.addPrice(Object.assign({}, {
                    packageId: this.packageId,
                    currentCenterId: User.currentCenterId,
                    pageNo:this.state.pageNo,
                    pageSize:this.state.pageSize
                }, values))
            }
        })
    };
    isEditing = (record) => {
        return record.id === this.state.packPriceId;
    };
    /**
     * 修改
     * @param record
     */
    editPrice = (record) => {
        this.setState({
            packPriceId: record.id,
            effectiveTime: record.effectiveTime,
            endTime:record.endTime,
            baseUnitPrice:record.baseUnitPrice,
            packagePrice:record.packagePrice,
            leaveTimes: record.leaveTimes
        });
    };
    /**
     * 关闭修改按钮
     */
    cancelPrice = () => {
        this.setState({
            packPriceId: null,
            effectiveTime: null,
            endTime:null,
            leaveTimes: null
        });
    };
    /**
     * 保存
     * @param record
     */
    savePrice =(record) => {
        const {effectiveTime,endTime}=this.state;
        const params = Object.assign({}, this.state, {
            packageId: this.packageId,
            currentCenterId: User.currentCenterId,
            id:record.id
        });
        if(effectiveTime > endTime){
            Message.error(`定价截止日必须大于等于定价起始日!`);
            return;
        }
        this.updatePrice(params)
    };
    /**
     * 添加定价
     * @param params
     */
    addPrice = (params:any) => {
        addCenterPackagePrice(params).then((res:any) => {
            Message.success("添加成功");
            this.cancelPrice();
            this.getHistoryList();
        });
    };
    /**
     * 修改定价
     * @param params
     */
    updatePrice = (params:any) => {
        updateCenterPackagePrice(params).then((res:any) => {
            Message.success("更新成功");
            this.cancelPrice();
            this.getHistoryList();
        });
    };
    onChangeStart = (date) => {
        this.setState({
            effectiveTime: +date.startOf('day')
        });
    };
    onChangeEnd = (date) => {
        // Todo 后台数据不能保存毫秒精度的时间戳
        this.setState({
            endTime: date.endOf('day').unix()*1000
        });
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo:any) => {
       this.setState({
           pageNo: pageInfo.pageNo,
           pageSize: pageInfo.pageSize
       }, this.getHistoryList)
    };
    // 表头配置
    columns = [{
        title: '执行结果',
        dataIndex: 'isNow',
        key: 'isNow',
        render:(text:any) => text ? "当前": ''
    }, {
        title: '定价起始日',
        dataIndex: 'effectiveTime',
        key: 'effectiveTime',
        render: (text:number, record:any) => {
            const editable = this.isEditing(record);
            return(
                <div>
                    {
                        editable
                            ? <DatePicker
                                onChange={this.onChangeStart}
                                defaultValue={moment(this.state.effectiveTime)}/>
                            : <span>{moment(text).format('YYYY-MM-DD')}</span>
                    }
                </div>
            )
        }
    }, {
        title: '定价截止日',
        dataIndex: 'endTime',
        key: 'endTime',
        render: (text:string, record:any) => {
            const editable = this.isEditing(record);
            return(
                <div>
                    {
                        editable
                            ? <DatePicker
                                onChange={this.onChangeEnd}
                                defaultValue={moment(this.state.endTime)}/>
                            : <span>{moment(text).format('YYYY-MM-DD')}</span>
                    }
                </div>
            )
        }
    }, {
        title: '定价（单价）',
        dataIndex: 'baseUnitPrice',
        key: 'baseUnitPrice',
        render: (text:string, record:any) => {
            const editable = this.isEditing(record);
            return(
                <div>
                    {
                        editable
                            ? <AntdNumber
                                defaultValue={this.state.baseUnitPrice}
                                onChange={(value:number) => {
                                    this.setState({
                                        baseUnitPrice: value,
                                        packagePrice: Math.floor(value * this.state.centerPackage.packageNum)
                                    })
                                }}
                                precision={2}
                                min={0}
                                value={this.state.baseUnitPrice}
                            />
                            : <span>{Number(text).toFixed(2)}</span>
                    }
                </div>
            )
        }
    },{
        title: '课程包定价',
        dataIndex: 'packagePrice',
        key: 'packagePrice',
        render: (text:string, record:any) => {
            const editable = this.isEditing(record);
            return(
                <div>
                    {
                        editable
                            ? <AntdNumber
                                defaultValue={this.state.packagePrice}
                                onChange={(value:number) => {
                                    this.setState({
                                        packagePrice: value,
                                        baseUnitPrice: (value / this.state.centerPackage.packageNum).toFixed(2)
                                    })
                                }}
                                precision={0}
                                min={0}
                                value={this.state.packagePrice}
                            />
                            : <span>{text}</span>
                    }
                </div>
            )
        }
    }, {
        title: '请假次数',
        dataIndex: 'leaveTimes',
        key: 'leaveTimes',
        render: (text:string, record:any) => {
            const editable = this.isEditing(record);
            return(
                <div>
                    {
                        editable
                            ? <AntdNumber
                                precision={0}
                                min={0}
                                max={999999999}
                                defaultValue={this.state.leaveTimes}
                                onChange={(value:number) => this.setState({leaveTimes:value})}/>
                            : <span>{text}</span>
                    }
                </div>
            )
        }
    }, {
        title: '操作',
        dataIndex: 'action',
        key:'action',
        width: 200,
        render:(text:string, record:any) => {
            const editable = this.isEditing(record);
            return (
                <div>
                    {
                        editable
                            ? <div>
                                <Button htmlType='button' className='span-link gym-button-white-xxs' onClick={() => this.savePrice(record)}>保存</Button>
                                <Button htmlType='button' className='span-link gym-button-white-xxs cancel' onClick={() => this.cancelPrice()}>取消</Button>
                            </div>
                            : <Button htmlType='button' className='span-link gym-button-white-xxs' onClick={() => this.editPrice(record)}>修改</Button>
                    }
                </div>
            )
        }
    }];
    render(){
        const {businessSourceMap} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {pageNo, pageSize, dataSource, centerPackage, totalSize} = this.state;
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
        return(
            <div className='gym-center-course-price'>
                <Form onSubmit={this.handleSubmit}>
                    <PageTitle title={`课程包定价`}/>
                    <div>
                        <Row>
                            <Col span={10}>
                                <FormItem label={`课程包代码`} {...formStyle}>
                                    <span>{centerPackage.packageCode}</span>

                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem label={`课程包名称`}  {...formStyle}>
                                    <span>{centerPackage.packageName}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <FormItem label={`课程包类型`} {...formStyle}>
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
                                <FormItem label={`固定合约频次`}  {...formStyle}>
                                    <span>{
                                        centerPackage.isUpperOrLower !== undefined
                                            ? CourseFrequency.filter((item) => item.value === centerPackage.isUpperOrLower)[0].name
                                            : null
                                    }</span>
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem label={`合约频次`}  {...formStyle}>
                                    <span>{centerPackage.nc}次/周</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <FormItem label={`有效期单位`} {...formStyle}>
                                    <span>月</span>
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem label={`标准有效期长度`}  {...formStyle}>
                                    <span>{centerPackage.validityPeriod}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <FormItem label={`课时数`} {...formStyle}>
                                    <span>{centerPackage.packageNum}课时</span>
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem label={`标准请假次数`}  {...formStyle}>
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
                    <PageTitle title='中心课程包定价' className='gym-setting-page-title'/>
                    <Row>
                        <Col span={10}>
                            <FormItem label='课程包单价' {...formStyle} >
                                {
                                  getFieldDecorator('baseUnitPrice', {
                                    rules: [{ required: true, message: '请输入课程包单价'}]
                                  })(
                                      <InputNumber precision={2}
                                                    min={0}
                                                    onChange={this.onChangeBaseUnitPrice}
                                                     className="inputWidth"
                                      />
                                  )
                                }
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem label={`课程包定价`} {...formStyle}>
                                {
                                  getFieldDecorator('packagePrice', {
                                    rules: [{ required: true, message: '请输入课程包定价'}]
                                  })(
                                      <InputNumber precision={0}
                                                   min={0}
                                                   onChange={this.onChangePackagePrice}
                                                    className="inputWidth"
                                      />
                                  )
                                }
                                <span className='gym-unit'>
                                </span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <FormItem label={`请假次数`} {...formStyle}>
                                {
                                    getFieldDecorator('leaveTimes', {
                                      rules: [{ required: true, message: '请输入请假次数'}]
                                    })(
                                        <InputNumber
                                            precision={0}
                                            min={0}
                                            max={999999999}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <FormItem label={`定价起始日`} {...formStyle}>
                                {
                                    getFieldDecorator('effectiveTime', {
                                      rules: [{ required: true, message: '请输入定价起始日'}]
                                    })(
                                        <DatePicker className="inputWidth" />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem label={`定价截止日`} {...formStyle}>
                                {
                                    getFieldDecorator('endTime', {
                                      rules: [{ required: true, message: '请输入定价截止日'}]
                                    })(
                                        <DatePicker className="inputWidth" />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2} className="add">
                            <button className="gym-button-xs gym-button-default">添加</button>
                        </Col>
                    </Row>
                </Form>
                <PageTitle title='中心课程包定价历史' className='gym-setting-page-title'/>
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

export {CourseCenterPrice}
