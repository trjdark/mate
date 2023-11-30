/**
 * desc: 总部课程包添加中心
 * Date: 2018/8/13
 * Time: 上午10:44
 */
import React from 'react';
import {Row, Col, Form, Input} from "antd";
import {Select,Option} from "@/ui/component/select";
import {form} from "../../../../../common/decorator/form";
import {SearchArea} from "../../../../component/searchArea";
import {getHqPackageCenter} from "@redux-actions/setting/courseGeneral";
import {
    selectCenterArea,
    selectCenterCity,
    selectCenterProvince,
} from "../../../../../saga/selectors/setting/center";
import {connect} from "../../../../../common/decorator/connect";
import {CenterStatus, DefaultCenterStatus} from "../../enum/centerInfo";
import {Message} from "../../../../component/message/message";
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";
import _ from 'lodash';
import {PageTitle} from "@/ui/component/pageTitle";

const FormItem = Form.Item;

@form()
@connect((state:any) => ({
    centerArea: selectCenterArea(state),
    centerProvince: selectCenterProvince(state),
    centerCity: selectCenterCity(state),
}), {})
class CourseGeneralSelectCenter extends React.Component<any, any>{
    constructor(props:any){
        super(props)
        this.state = {
            pageSize:10,
            pageNo:1,
            dataSource: [],
            totalSize: 0,
            districtId:"",
            provinceId:"",
            cityId:"",
            centerCode:"",
            centerName:"",
            gi:"",
            isEnabled:1,
            selectedRows:[],
            selectedKeys:[],
            isFold:true,
        }
    }
    componentDidMount(){
        this.getData();
    }
    /**
     * 获取数据
     */
    getData = () => {
        const {
            pageNo, pageSize, districtId, provinceId, cityId,
            centerCode, centerName, gi, isEnabled
        } = this.state;
        getHqPackageCenter({
            pageNo, pageSize,
            districtId, provinceId, cityId,
            centerCode, centerName, gi, isEnabled,
            currentCenterId:User.currentCenterId,
            id:this.props.pid
        }).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize,
            })
        });
    };
    /**
     * 重置
     */
    onReset = () => {
        this.props.form.resetFields();
    };
    /**
     * 搜索
     * @param e
     */
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({
                    ...values,
                    pageNo:1,
                    selectedKeys:[]
                }, this.getData);
            }
        });

    };
    /**
     * 翻页
     */
    handleChangePage = (pageInfo:any) => {
        this.setState({
            pageNo:pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
            selectedKeys:[]
        }, this.getData)
    };

    /**
     * 添加中心
     */
    saveCenter(){
        let selectedData=this.state.selectedRows;

        if(!selectedData.length){
            Message.warning("请勾选中心!");
            return;
        }
        this.props.closeAddCenter();
        this.props.onAddCenter(selectedData);
    }
    // 表头设置
    columns = [{
        title: '中心编号',
        dataIndex: 'centerCode',
        key: 'centerCode',
        width:'10%'
    }, {
        title: '中心名称',
        dataIndex: 'centerName',
        key: 'centerName',
        width:'15%'
    }, {
        title: 'GI',
        dataIndex: 'gi',
        width:80
    }, {
        title: 'FOC',
        dataIndex: 'foc',
        width:80
    }, {
        title: '区域',
        dataIndex: 'districtId',
        width:80
    }, {
        title: '省份',
        dataIndex: 'provinceId',
        width:150
    },{
        title: '城市',
        dataIndex: 'cityId',
        width:150
    },{
        title: '状态',
        dataIndex: 'isEnabled',
        width:100,
        render: (text) => text ? '启用' : '停用'
    }];
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedKeys: selectedRowKeys });
    };
    onSelectSelect = (record, selected) => {
        const {dataSource, selectedRows} = this.state;
        // 正选
        if (selected) {
            let recordSource = dataSource.filter(item => item.centerCode===record.centerCode);
            this.setState({
                selectedRows:[...selectedRows, recordSource[0]],
            });
            // 反选
        } else {
            let _selectedRows = this.state.selectedRows;
            _.remove(_selectedRows,(item:any) => item.centerCode === record.centerCode)
            this.setState({
                selectedRows:_selectedRows,
            });
        }
    };
    onSelectSelcetAll = (record, selected) => {
        this.setState({selectedRows:selected})
    };
    onGetCheckBox = (record) => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
    });
    render(){
        const {getFieldDecorator} = this.props.form;
        const {centerArea, centerProvince, centerCity, form} = this.props;
        const {dataSource, totalSize, pageNo, pageSize} = this.state;
        const rowSelection = {
            selectedRowKeys:this.state.selectedKeys,
            onChange: this.onSelectChange,
            onSelect: this.onSelectSelect,
            onSelectAll: this.onSelectSelcetAll,
            getCheckboxProps: this.onGetCheckBox
        };
        return(
            <div id='gym-general-course-select-center' className='gym-general-course-center'>
                <PageTitle title={`添加适用中心`}/>
                <Form onSubmit={this.handleSearch.bind(this)}>
                    <Row>
                        <Col span={8}>
                            <FormItem label={'中心编号'}>
                                {
                                    getFieldDecorator('centerCode')(
                                        <Input placeholder={`中心编号`}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={'中心名称'}>
                                {
                                    getFieldDecorator('centerName')(
                                        <Input placeholder={`中心名称`}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={'GI'}>
                                {
                                    getFieldDecorator('gi')(
                                        <Input placeholder={`GI`}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <div>
                        <SearchArea
                            form={form}
                            centerArea={centerArea}
                            centerProvince={centerProvince}
                            centerCity={centerCity}
                        />
                        <Row>
                            <Col span={8}>
                                <FormItem label={'状态'}>
                                    {
                                        getFieldDecorator('isEnabled', {
                                            initialValue: DefaultCenterStatus
                                        })(
                                            <Select
                                                getPopupContainer={() => document.querySelector('.gym-general-course-center')}
                                            >
                                                {
                                                    (CenterStatus || []).map((item:any) =>
                                                        <Option key={item.code} value={item.code}>
                                                            {item.codeValue}
                                                        </Option>
                                                    )
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8} offset={8}>
                                <button
                                    className='gym-button-xs gym-button-wBlue mr10 fr'
                                    onClick={this.onReset}>重置</button>
                                <button className='gym-button-xs gym-button-blue mr10 fr'>查询</button >
                            </Col>
                        </Row>
                    </div>
                </Form>
                <TablePagination
                    totalSize={totalSize}
                    pageNo={pageNo}
                    pageSize={pageSize}
                    rowSelection={rowSelection}
                    rowKey="id"
                    handleChangePage={this.handleChangePage}
                    columns={this.columns}
                    dataSource={dataSource}/>
                <Row>
                    <Col span={24}>
                        <div  className='text-c mt30'>
                            <button
                                className='gym-button-sm gym-button-default mr20'
                                onClick={this.saveCenter.bind(this)}>确定添加</button>
                            <button
                                className='gym-button-xs gym-button-white'
                                onClick={this.props.closeAddCenter}
                            >取消</button>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export {CourseGeneralSelectCenter}
