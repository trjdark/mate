/**
 * desc: 360tab表单
 * User: zhang
 * Date: 2018/11/9
 * Time: 下午2:23
 */
import React  from 'react';
import {Tabs, Modal as AntdModal} from 'antd';
import './index.scss'

const TabPane = Tabs.TabPane;
import {User} from "@/common/beans/user";
import {
    getBabyInformation,
    deleteCustomerBabyInfo,
    getCustomerContactInfo,
    deleteCustomerContactInfo, getLeadsOperatedLogInfo
} from '@redux-actions/client360';
import {selectEditPermission, selectFamilyRelation} from '@/saga/selectors/customer/client360'
import {Modal} from '@/ui/component/customerCreateModal';
import {connect} from "@/common/decorator/connect";
import {PageTitle} from "@/ui/component/pageTitle";
import {Table} from "@/ui/component/tablePagination";
import moment from "moment";

@connect((state: any) => ({
    familyRelationList: selectFamilyRelation(state),
    isEdit: selectEditPermission(state).hasEditPermission,
    isPhoneEdit: selectEditPermission(state).hasModifiedMobilePermission
}), {})
class TabForm360 extends React.Component <any, any> {
    newTabIndex: number;

    constructor(props: any) {
        super(props);
        this.newTabIndex = 1;// 内部计数tabs
        this.state = {
            activeKey: '1',//当前激活的tabkey
            panes: [],
            visible: false,
            targetKey: undefined,//删除目标的tabkey
            logoInfo:[],
            visibleLogo:false

        };
    }


    componentDidMount() {
        getLeadsOperatedLogInfo({
            currentCenterId: User.currentCenterId,
            leadsId: this.props.leadsId
        }).then((res:any) => {
            this.setState({logoInfo: res})
        })
        // 宝宝信息请求初始tab
        if (this.props.title === '新客户') {
            getBabyInformation({
                currentCenterId: User.currentCenterId,
                leadsId: this.props.leadsId
            })
                .then(res => {
                    let panes = res.map((info, idx) => {
                        this.newTabIndex++;
                        return {
                            title: info.babyName,
                            content: this.props.render({
                                tabKey: `${idx + 1}`,
                                onTitleChange: this.onTitleChange,
                                initdata: info
                            }),
                            key: `${idx + 1}`,
                            initdata: info
                        }
                    })
                    this.setState({panes, activeKey: panes[0].key})
                }, err => {
                    console.log('getBabyInformation err....', err)
                })
        }

        // 联系人信息请求初始tab
        if (this.props.title === '新联系人') {
            getCustomerContactInfo({
                currentCenterId: User.currentCenterId,
                leadsId: this.props.leadsId
            })
                .then(res => {
                    let panes = res.map((info, idx) => {
                        this.newTabIndex++;
                        return {
                            title: this.filterTabTitle(info.familyRelation),
                            content: this.props.render({
                                tabKey: `${idx + 1}`,
                                onTitleChange: this.onTitleChange,
                                initdata: info
                            }),
                            key: `${idx + 1}`,
                            initdata: info,
                            closable:false
                        }
                    })
                    this.setState({panes, activeKey: panes[0].key})
                }, err => {
                    console.log('getCustomerContactInfo err....', err)
                })
        }
    }

    filterTabTitle = (code) => {
        let item = this.props.familyRelationList.filter(item => item.code === code)
        return item[0] ? item[0].codeValue : '';
    }

    onTitleChange = (obj) => {
        const panes = this.state.panes.map(pane => {
            if (pane.key === obj.key) {
                pane.title = obj.value
                return pane;
            } else {
                return pane
            }
        });
        this.setState({panes});
    }

    onChange = (activeKey) => {
        this.setState({activeKey});
    }

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }

    add = () => {
        const panes = this.state.panes;

        // 不超过15个
        if (panes.length >= 15) return;

        const activeKey = `${this.newTabIndex++}`;
        panes.push({
            title: this.props.title,
            content: this.props.render({
                tabKey: activeKey,
                onTitleChange: this.onTitleChange
            }),
            key: activeKey
        });
        this.setState({panes, activeKey});
    }

    remove = (targetKey) => {
        if (this.state.panes.length === 1) return;
        this.setState({visible: true, targetKey})
    }

    handleCancel = () => {
        this.setState({visible: false})
    }

    handleOk = () => {

        let targetKey = this.state.targetKey;

        // 新增：调用接口删除单个tab
        const paneRemove = this.state.panes.filter(pane => pane.key === targetKey)[0];

        // 表示已经保存的标签页
        if (paneRemove.initdata) {
            if (this.props.title === "新客户") {
                deleteCustomerBabyInfo({
                    currentCenterId: User.currentCenterId,
                    leadsId: this.props.leadsId,
                    id: paneRemove.initdata.id
                }).then(res => {
                    // 原删除tab逻辑，仅在成功删除后执行
                    let activeKey = this.state.activeKey;
                    let lastIndex;
                    this.state.panes.forEach((pane, i) => {
                        if (pane.key === targetKey) {
                            lastIndex = i - 1;
                        }
                    });
                    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
                    if (lastIndex >= 0 && activeKey === targetKey) {
                        activeKey = panes[lastIndex].key;
                    }
                    if (lastIndex < 0 && activeKey === targetKey) {
                        activeKey = panes[0].key;
                    }
                    this.setState({panes, activeKey, visible: false});
                }, err => {
                    this.setState({visible: false})
                })
            }
            if (this.props.title === "新联系人") {
                deleteCustomerContactInfo({
                    currentCenterId: User.currentCenterId,
                    leadsId: this.props.leadsId,
                    id: paneRemove.initdata.id
                }).then(res => {
                    // 原删除tab逻辑，仅在成功删除后执行
                    let activeKey = this.state.activeKey;
                    let lastIndex;
                    this.state.panes.forEach((pane, i) => {
                        if (pane.key === targetKey) {
                            lastIndex = i - 1;
                        }
                    });
                    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
                    if (lastIndex >= 0 && activeKey === targetKey) {
                        activeKey = panes[lastIndex].key;
                    }
                    if (lastIndex < 0 && activeKey === targetKey) {
                        activeKey = panes[0].key;
                    }
                    this.setState({panes, activeKey, visible: false});
                }, err => {
                    this.setState({visible: false})
                })
            }

            // !paneRemove.initdata 表示还未保存的标签页
        } else {
            let activeKey = this.state.activeKey;
            let lastIndex;
            this.state.panes.forEach((pane, i) => {
                if (pane.key === targetKey) {
                    lastIndex = i - 1;
                }
            });
            const panes = this.state.panes.filter(pane => pane.key !== targetKey);
            if (lastIndex >= 0 && activeKey === targetKey) {
                activeKey = panes[lastIndex].key;
            }
            if (lastIndex < 0 && activeKey === targetKey) {
                activeKey = panes[0].key;
            }
            this.setState({panes, activeKey, visible: false});
        }

    }
     /**
      * 向组件添加属性
      * @param content:reactDom
      * @returns {any}
      */
    addPropToContent = (content) => {
        const {isEdit, isPhoneEdit} = this.props;
        return React.Children.map(content, child => React.cloneElement(
            child,
            {
                isEdit, isPhoneEdit
            }
        ));
    };

    getClosable=(pane)=>{
        const {panes}=this.state;
        const {title}=this.props;
        if(title==='新客户'){
            return panes.length>1? pane.closable : false;
        }else if(title==='新联系人'){
            return pane.closable
        }
    };
    showLogoInfo = () => {
        this.setState({visibleLogo:true})
    };
    columns = [
        {
            title: '修改日期',
            dataIndex: 'createDate',
            render: (date) => moment(date).format("YYYY-MM-DD"),
            width: 120
        },
        {
            title: '操作人',
            dataIndex: 'operator',
            width: 150
        },
        {
            title: '修改明细',
            dataIndex: 'remark',
        },
    ];
    render() {
        let {panes} = this.state;
        return (
            <div className='component-gym-tab-form-360' style={this.props.style}>
                <Tabs
                    onChange={this.onChange}
                    activeKey={this.state.activeKey}
                    type="editable-card"
                    onEdit={this.onEdit}
                    hideAdd={true}
                    tabBarExtraContent={<div className="logo-info">
                        <button className="gym-button-xs gym-button-wBlue logo-button mr10" onClick={this.showLogoInfo}>修改日志</button>
                        <div onClick={this.add} className="extra-add">+新增</div>
                    </div>}
                >
                    {panes.map(pane =>
                        <TabPane tab={pane.title}
                                 key={pane.key}
                                 closable={this.getClosable(pane)}
                                 forceRender={true}
                        >
                            {this.addPropToContent(pane.content)}
                        </TabPane>
                    )}
                </Tabs>
                <Modal
                    visible={this.state.visible}
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                    contentText={'是否确认删除？'}
                />

                <AntdModal
                    visible={this.state.visibleLogo}
                    onCancel={() => {this.setState({visibleLogo: false})}}
                    width={800}

                    footer={false}
                >
                    <PageTitle title="修改日志"/>
                    <Table
                        dataSource={this.state.logoInfo}
                        columns={this.columns}
                        rowKey="id"
                    />
                </AntdModal>
            </div>
        )
    }
}

export {TabForm360}
