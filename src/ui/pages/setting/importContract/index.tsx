import React, {Component, Fragment} from 'react'
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PageTitle} from "@/ui/component/pageTitle";
import {Form, Row, Col, Upload, Button} from "antd";
import {form} from "@/common/decorator/form";
import {Option, Select} from "@/ui/component/select";
import {User} from "@/common/beans/user";
import {getCenterEmployeeList} from "@redux-actions/setting/center";
import {connect} from "@/common/decorator/connect";
import {selectBusinessSourceList} from "@/saga/selectors/home";
import {SetApi} from "@/api/settingApi";
import {Storage} from "@/common/utils/storage";
import {fileDownload} from "@redux-actions/customer/batchImport";

const FormItem = Form.Item;

@form()
@connect(state => ({
    businessSourceMap:selectBusinessSourceList(state)
}))
class ImportContract extends Component<any, any>{
    private routes = [
        {name: '设置', path: '', link: '#', id: 'setting'},
        {name: '运营管理', path: '', link: '#', id: 'setting-operation'},
        {name: '合同批量导入', path: '', link: '#', id: 'setting-operation-import'},
    ];
    private inputFile:any;
    constructor(props) {
        super(props);
        this.state = {
            gbList: [],
            file:null
        }
    }

    /**
     * 选择中心
     * @param e
     */
    handleChangeCenter = (e) => {
        this.setState({gbList: []}, () => {
            this.getEmployeeList(e)
        })
    }
    /**
     * 获取GB
     * @param id
     */
    getEmployeeList = (id:string) => {
        const param = {
            centerId: id,
            currentCenterId:User.currentCenterId
        }
        getCenterEmployeeList(param).then(res => {
            this.setState({gbList: res.filter(item => ['1', '2'].includes(item.workingStatus) &&  (item.roleList.includes('GB') || item.roleList.includes('HGB')))})
        })
    }
    /**
     * 下载模版
     */
    downloadModal = () => {
        fileDownload({
            currentCenterId: User.currentCenterId,
            fileName:'合同批量导入模版.xlsx'
        })
    }
    render (){
        const {form, businessSourceMap} = this.props;
        const {gbList} = this.state;
        const {getFieldDecorator, getFieldValue} = form;
        return(
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap'>
                    <PageTitle title={<div><span>批量导入合同</span><span className='ml30 size14 cDefault pointer' onClick={this.downloadModal}>下载模版</span></div>}/>
                    <Form>
                        <Row>
                            <Col span={8}>
                                <FormItem label={'选择合同导入中心'}
                                          labelCol={{xs: {span: 2}, sm: {span:8}}}
                                          wrapperCol = {{xs:{span:6}, sm: {span: 16}}}
                                >
                                    {
                                        getFieldDecorator('dataCenterId', {
                                            rules: [{required: true, message: '请输入中心'}],
                                        })(
                                            <Select
                                                className='gym-center-add-select'
                                                style={{width: 200}}
                                                onChange={this.handleChangeCenter}
                                            >
                                                {
                                                    (User.staffCenterList || []).map((item: any, index: number) => (
                                                        <Option key={`${index}`} title={item.centerName} value={item.id}>
                                                            {`${item.centerCode}-${item.centerName}`}
                                                        </Option>
                                                    ))
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            {
                                gbList.length > 0
                                && <Col span={8}>
                                    <FormItem label={'选择合同所属GB'}
                                              labelCol={{xs: {span: 2}, sm: {span:8}}}
                                              wrapperCol = {{xs:{span:6}, sm: {span: 16}}}
                                    >
                                        {
                                            getFieldDecorator('gbStaffId', {
                                                rules: [{required: true, message: '请选择GB'}],
                                            })(
                                                <Select
                                                    className='gym-center-add-select'
                                                    style={{width: 200}}
                                                >
                                                    {
                                                        gbList.map((item: any, index: number) => (
                                                            <Option key={`${index}`}  value={item.staffId}>
                                                                {`${item.englishName}-${item.chineseName}`}
                                                            </Option>
                                                        ))
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            }
                            {
                                gbList.length > 0
                                && <Col span={8}>
                                    <FormItem label={'选择合同业务来源'}
                                              labelCol={{xs: {span: 2}, sm: {span:8}}}
                                              wrapperCol = {{xs:{span:6}, sm: {span: 16}}}
                                    >
                                        {
                                            getFieldDecorator('businessSourceCode', {
                                                rules: [{required: true, message: '业务来源'}],
                                            })(
                                                <Select
                                                    className='gym-center-add-select'
                                                    style={{width: 200}}
                                                >
                                                    {
                                                        businessSourceMap.map((item: any, index: number) => (
                                                            <Option key={`${index}`}  value={item.businessSourceCode}>
                                                                {item.businessSourceValue}
                                                            </Option>
                                                        ))
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            }
                        </Row>
                        {
                            (gbList.length > 0  && getFieldValue('businessSourceCode') && getFieldValue('gbStaffId'))
                            && <Row>
                                <Col>
                                    <Upload
                                        action={'/api' + SetApi.导入合同leads}
                                        showUploadList={false}
                                        headers={
                                            Object.assign({},  {
                                                centerCode: User.centerCode,
                                                userId: User.userId,
                                                userName: User.userName,
                                                'token':Storage.get('_token'),
                                            })
                                        }
                                        data={{
                                            dataCenterId: getFieldValue('dataCenterId'),
                                            gbStaffId: getFieldValue('gbStaffId'),
                                            businessSourceCode: getFieldValue('businessSourceCode'),
                                            currentCenterId:User.currentCenterId
                                        }}
                                    >
                                        <Button
                                            htmlType="button"
                                            type="primary"
                                            className="gym-radius-btn"
                                        >
                                            选择文件
                                        </Button>
                                    </Upload>
                                </Col>
                            </Row>
                        }

                    </Form>
                </div>
            </Fragment>
        )
    }
}

export {ImportContract}
