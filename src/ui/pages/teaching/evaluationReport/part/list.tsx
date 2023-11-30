/**
 * desc: 测评报告列表
 * User: Vicky
 * Date: 2020/08/03
 * Time: 17:30
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import {Routes} from "@/router/enum/routes";
import { form } from "@/common/decorator/form";
import { Modal, Form, Select, message} from "antd";
import { CustomerRoutes } from "@/router/enum/customerRoutes";
import history from "@/router/history";
import { User } from "@/common/beans/user";
import { CommonUtils } from '@/common/utils/commonUtils';
import { PageTitle } from '@/ui/component/pageTitle';
import { Row, Col, Button } from 'antd';
import { Filter } from "@/filter/filter";
import moment from 'moment';
import { selectTotalEmployeeList } from "@/saga/selectors/home";
import { getReportList, getUserfulMonths, getBabysReportList, getBabysReportListALL,getDefaultCourse } from '@redux-actions/teaching/evaluationReport';
import { connect } from "@/common/decorator/connect";
import {FUNC} from "@/ui/pages/setting/enum/functions";

const FormItem = Form.Item;
const { Option } = Select;

const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])
const selectInsOption = isPostTransRole
    ? {
        leaveDate: moment().add(-0.5, 'y').valueOf(),
        roleList: ['GB', 'HGB']
    }
    : {
        leaveDate: moment().add(-0.5, 'y').valueOf(),
        postName: ["GB", 'HGB']
    };


const staffListOption = {
    leaveDate: moment().add(-0.5, 'y').valueOf(),
};



@connect((state: any) => ({
    staffList: selectTotalEmployeeList(state, staffListOption),
    gbList: selectTotalEmployeeList(state, selectInsOption)
}), {})
@form()
class EvalutionReportList extends React.Component<any, any> {
    private routes: Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching'
        }, {
            name: '教学管理',
            path: '',
            link: '#',
            id: 'teachingOperation'
        }, {
            name: '到访测评',
            path: '',
            link: '#',
            id: 'evaluationReportList'
        }
    ];
    searchConfig = ():Array<any> => {
        const { staffList, gbList} = this.props;
        const staffOption = staffList.map((item: any) => ({ postCode: item.staffId, postName: `${item.englishName} ${item.chineseName}` }));
        const gbOption = gbList.map((item: any) => ({ postCode: item.staffId, postName: `${item.englishName} ${item.chineseName}`}));
        return [{
            label: '宝宝姓名',
            required: false,
            type: 'text',
            placeholder: '请输入',
            name: 'babyName',
        }, {
            label: '手机号码',
            required: false,
            type: 'text',
            placeholder: '请输入',
            name: 'telephone',
        } , {
            label: '测评日期',
            required: false,
            type: 'rangePicker',
            placeholder: '请输入',
            name: 'date',
        }, {
            label: 'GB',
            required: false,
            type: 'select',
            placeholder: '请输入',
            name: 'gbStaffId',
            options: gbOption
        }, {
            label: '测评人',
            required: false,
            type: 'select',
            placeholder: '请输入',
            name: 'assessStaff',
            options: staffOption

        }]
    };
    constructor(props:any){
        super(props)
        this.state = {
            pageNo: 1,
            pageSize:10,
            telephone: '',
            babyName: '',
            visible: false,
            dataSource: [],
            totalSize: 0,
            babyId: '',
            leadsId: '',
            babyReportList: [], // 宝宝下拉报告列表
            selectMonthVisable: false,
            reportListVisable: false, // 测评报告列表
            reportVisable: false, // 报告
            defaultCourseId: '', // 默认学阶
            gbList: [],
            assessStaff: '', // 测评人
            gbStaffId: '', // GB
            assessStartDate: '',
            assessEndDate: '',
        };
    }
    columns = ()=>[
        {
            title: "宝宝姓名",
            dataIndex: 'babyName',
            render(text, record) {
                return <a href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target="_blank">{text}</a>
            }
        },
        {
            title: "月龄",
            dataIndex: 'babyMonth',
        },{
            title: "联系人",
            dataIndex: 'contactName',
        }, {
            title: "最近测评时间",
            dataIndex: 'lastAssessDate',
            render:(text:any)=>text&&moment(text).format('YYYY-MM-DD')
        },{
            title: "GB",
            dataIndex: 'gbName',
        }, {
            title: "测评人",
            dataIndex: 'assessStaff',
        },{
            title: "归属",
            dataIndex: 'phase',
            render: (text, record) => Filter.formatReportPhase(text)
        },
        {
            title: "操作",
            dataIndex: 'action',
            render: (text, record) =>
                <div>
                    <Button className="gym-button-xxs gym-button-white mr15" onClick={() => { this.detail(record) }} disabled={record.assessed === 0 ? true : false} data-type="detail">查看</Button>
                    <Button className="gym-button-xxs gym-button-white mr15" onClick={() => { this.edit(record) }} disabled={record.assessed === 0 ? true : false} data-type="edit">编辑</Button>
                    <Button className="gym-button-xxs gym-button-white mr15" onClick={() => {this.create(record)}}>测评</Button>
                </div>
        }
    ];

    handleSearch = () => {
        const { pageNo, pageSize, babyName, telephone, gbStaffId, assessStaff, assessStartDate, assessEndDate} = this.state;
        getReportList({ currentCenterId: User.currentCenterId, pageNo, pageSize, babyName, telephone, assessStaff, gbStaffId, assessStartDate, assessEndDate}).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    }
    /**
     * 搜索
     */
    onSearch = (values) => {
        values.assessStartDate = values.date ? moment(values.date[0]).startOf('day').valueOf() : '';
        values.assessEndDate = values.date ? moment(values.date[1]).endOf('day').valueOf() : '';
        this.setState({
            ...values,
            pageNo:1,
        }, this.handleSearch);
    };
    /**
     * 测评
     */
    create = (record:any) => {
        if (record.phase==="0"){
            message.warning('该leads现在在回收站，请先转移至待分配再进行测评。')
            return false
        }
        this.setState({ babyId: record.babyId,leadsId: record.leadsId });
        getUserfulMonths({ currentCenterId: User.currentCenterId, babyId: record.babyId, leadsId: record.leadsId }).then((res: any) => {
            this.setState({ monthsSelect: res });
        })
        getDefaultCourse({ currentCenterId: User.currentCenterId, babyId: record.babyId, leadsId: record.leadsId}).then((res:any) => {
            this.setState({ defaultCourseId: res})
        })
        this.setState({ selectMonthVisable: true});
    }
    /**
     * 编辑
     */
    edit = (record:any,) => {
        this.setState({ babyId: record.babyId, leadsId: record.leadsId });
        getBabysReportList({ babyId: record.babyId, currentCenterId: User.currentCenterId, leadsId: record.leadsId}).then((res:any)=>{
            this.setState({babyReportList: res});
        })
        this.setState({reportListVisable: true});
    }
    /**
     * 查看
     */
    detail = (record: any) => {

        this.setState({ babyId: record.babyId, leadsId: record.leadsId });
        getBabysReportListALL({ babyId: record.babyId, currentCenterId: User.currentCenterId, leadsId: record.leadsId }).then((res: any) => {
            this.setState({ babyReportList: res });
        })
        this.setState({ reportVisable: true });
    }
    // 选择月龄 (测评)
    onSubmitMonths = () => {
        const { form } = this.props;
        const { leadsId, babyId} = this.state;
        form.validateFields((err: any, values) => {
            if (!err) {
                history.push(`${Routes.测评报告新建.link}${CommonUtils.stringify({
                    id: values.id,
                    babyId: babyId,
                    leadsId: leadsId,
                })}`)
            }
        })
    }
    // 选择测评报告（月龄）
    onSubmitReport = () => {
        const { form } = this.props;
        const { leadsId, babyId } = this.state;
        form.validateFields((err: any, values) => {
            if (!err) {
                history.push(`${Routes.测评报告编辑.link}${CommonUtils.stringify({
                    id: values.id,
                    babyId: babyId,
                    leadsId: leadsId,
                })}`)
            }
        })
    }

    submitReport = () => {
        const { form } = this.props;
        const { leadsId, babyId } = this.state;
        form.validateFields((err: any, values) => {
            if (!err) {
                history.push(`${Routes.测评报告详情.link}${CommonUtils.stringify({
                    id: values.id,
                    babyId: babyId,
                    leadsId: leadsId,
                })}`)
            }
        })
    }
    /**
     * 关闭弹窗
     */
    handleClose = () => {
        this.setState({ visible: false, selectMonthVisable: false, reportListVisable: false, reportVisable:false });
    }
    /**
     * 切换页数
     */
    handleChangePage = (pageInfo: any) => {
        this.setState(pageInfo, this.handleSearch);
    };
    selectCourseId = (value,key) => {
    }
    render() {
        const { form} = this.props;
        const {getFieldDecorator} = form;
        const { pageSize, pageNo, dataSource, totalSize, reportVisable, monthsSelect, selectMonthVisable, babyReportList, reportListVisable } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id={`gym-review`} className="gym-review-list page-wrap">
                    <SearchForm
                        items={this.searchConfig()}
                        onSearch={this.onSearch}
                    />
                    <TablePagination
                        columns={this.columns()}
                        rowKey={'babyId'}
                        dataSource={dataSource}
                        totalSize={totalSize}
                        pageSize={pageSize}
                        handleChangePage={this.handleChangePage}
                        pageNo={pageNo}
                    />
                </div>
                <Modal
                    visible={selectMonthVisable}
                    closable={false}
                    destroyOnClose={true}
                    centered={true}
                    footer={false}
                    onCancel={() => this.setState({ selectMonthVisable: false })}
                >
                    <div>
                        <PageTitle title={`选择月龄`} />
                        <Form>
                            <Row>
                                <Col>
                                    <FormItem label={`月龄:`} className='flex'>
                                        {
                                            getFieldDecorator(`id`, {
                                                rules: [{ required: true, message: '请选择' }],
                                                initialValue: '',
                                            })(
                                                <Select
                                                    placeholder={'请选择'}
                                                    style={{ width: '250px' }}
                                                >
                                                    {
                                                        monthsSelect && monthsSelect.map(item => (
                                                            <Option value={item.courseId} key={item.courseId} disabled={item.assessed === 1 ? true : false}>
                                                                {item.courseCode}-({item.beginMonth}-{item.endMonth}个月)
                                                            </Option>
                                                        ))
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <div className="gym-call-parent-modal-main-form-buttons">
                                <button className="gym-button-default gym-button-xs mr10" onClick={this.onSubmitMonths}>确定</button>
                                <button className="gym-button-white gym-button-xs" onClick={this.handleClose}>取消</button>
                            </div>
                        </Form>
                    </div>
                </Modal>
                <Modal
                    visible={reportListVisable}
                    closable={false}
                    destroyOnClose={true}
                    centered={true}
                    footer={false}
                    onCancel={() => this.setState({ reportListVisable: false })}
                >
                    <div>
                        <PageTitle title={`选择测评报告`} />
                        <Form>
                            <Row>
                                <Col>
                                    <FormItem label={`测评报告:`} className='flex'>
                                        {
                                            getFieldDecorator(`id`, {
                                                rules: [{ required: true, message: '请选择' }],
                                                initialValue: ''
                                            })(
                                                <Select
                                                    placeholder={'请选择'}
                                                    style={{ width: '250px' }}
                                                    onSelect={this.selectCourseId}
                                                >
                                                    {
                                                        babyReportList && babyReportList.map(item => (
                                                            <Option value={item.reportId} key={item.reportId}>
                                                                {item.courseCode}-({item.beginMonth}-{item.endMonth}个月)-{moment(item.assessDate).format('YYYY-MM-DD')}
                                                            </Option>
                                                        ))
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <div className="gym-call-parent-modal-main-form-buttons">
                                <button className="gym-button-default gym-button-xs mr10" onClick={this.onSubmitReport} data-type="edit">确定</button>
                                <button className="gym-button-white gym-button-xs" onClick={this.handleClose}>取消</button>
                            </div>
                        </Form>
                    </div>
                </Modal>
                <Modal
                    visible={reportVisable}
                    closable={false}
                    destroyOnClose={true}
                    centered={true}
                    footer={false}
                    onCancel={() => this.setState({ reportVisable: false })}
                >
                    <div>
                        <PageTitle title={`选择测评报告`} />
                        <Form>
                            <Row>
                                <Col>
                                    <FormItem label={`测评报告:`} className='flex'>
                                        {
                                            getFieldDecorator(`id`, {
                                                rules: [{ required: true, message: '请选择' }],
                                                initialValue: ''
                                            })(
                                                <Select
                                                    placeholder={'请选择'}
                                                    style={{ width: '250px' }}
                                                >
                                                    {
                                                        babyReportList && babyReportList.map(item => (
                                                            <Option value={item.reportId} key={item.reportId}>
                                                                {item.courseCode}-({item.beginMonth}-{item.endMonth}个月)-{moment(item.assessDate).format('YYYY-MM-DD')}
                                                            </Option>
                                                        ))
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <div className="gym-call-parent-modal-main-form-buttons">
                                <button className="gym-button-default gym-button-xs mr10" onClick={this.submitReport} data-type="edit">确定</button>
                                <button className="gym-button-white gym-button-xs" onClick={this.handleClose}>取消</button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}

export { EvalutionReportList}
