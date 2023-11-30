/**
 * desc: 模版头部组件
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/8/3
 * Time: 上午11:01
 */
import React from 'react';
import {Dropdown, Menu} from 'antd';
//此处不能用自定义select
import {Select} from "antd";
const SelectOption = Select.Option;
import {User} from "@/common/beans/user";
import {logout} from "@redux-actions/authActions";
import {SearchInput} from "@/ui/component/searchButton";
import {Icon} from "@/ui/component/icon";
import {connect} from "@/common/decorator/connect";
import {commonInit, ppsUrl, segmaPpsUrl, getBasicOption} from "@redux-actions/homeActions";
import {Message} from "@/ui/component/message/message";
import {innerHeaderSearch, storeHeaderSearch} from "@redux-actions/customer/innerQuery";
import {CommonUtils} from "@/common/utils/commonUtils";
import {TYPE} from "@/ui/containers/layout/enum/headerEnum";
import {NoReadNotice} from "@/ui/containers/layout/part/noReadNotice";
import {Utils} from "@/ui/containers/layout/part/uitls";
import {acceptNotice} from "@redux-actions/taskCenter";
import {Routes} from "@/router/enum/routes";


@connect(() => ({}), {commonInit, storeHeaderSearch, innerHeaderSearch, acceptNotice})
class Header extends React.Component <any, any> {
    state = {
        isDropdown: false,
        isFeedBackDropdown: false,
        isShopDropdown: false,
        ppsUrl: '',
        searchType: TYPE.宝宝姓名,
        searchVisible: false,// 搜索类型选择框是否可见
    };
    componentWillUnmount(){}
    /**
     * 切换中心
     * @param {string} centerId
     * @param option
     */
    handleChange = (centerId: string) => {
        const newCenter:any = User.staffCenterList.filter((item: any) => item.id === centerId)[0];
        // 更新所在中心信息
        User.user = Object.assign({}, User.user, {
            currentCenterName: newCenter.centerName,
            currentCenterId: newCenter.id,
            centerCode: newCenter.centerCode,
            isHQ: centerId === 'C_HQ001',
        });
        const param = {
            staffId: User.userId,
            currentCenterId: newCenter.id,
            centerId: newCenter.id,
        };
        getBasicOption(param).then(() => {
            setTimeout( () => {
                window.location.href = Routes.首页.path;
            }, 300)
        });
    };

    /**
     * 退出
     */
    handleLogout = () => {
        logout();
    };
    /**
     * 监听点击管理员事件，
     */
    visibleChang = (value: boolean) => {
        this.setState({isDropdown: value})
    };

    visibleShop = (value: boolean) => {
        this.setState({isShopDropdown: value})
    };
    /**
     * 大搜索框搜索
     * @param value
     * @returns {any}
     */
    handleSearch = (value, searchType) => {
        const phoneReg = /^1[3456789]\d{9}$/;
        const lastFourPhoneReg = /^\d{4}$/;
        if (!value) {
            Message.error('请输入查询内容');
        }
        if (searchType === TYPE.手机号) {
            if (!phoneReg.test(value) && !lastFourPhoneReg.test(value)) {
                Message.error('请输入手机尾号后四位或完整手机号码');
                return;
            }
        } else {
            if (value.length < 2) {
                Message.error('至少输入两个字符');
                return;
            }
        }
        this.props.storeHeaderSearch({
            searchStr: value,
            searchType
        });
        // Todo 跳转客户中心
        window.location.href = `${Routes.新客户中心.link}/${CommonUtils.stringify({type:searchType, value:value})}`
        return;
    };
    /**
     * 菜单
     */
    menu = () => (
        <Menu className='gym-layout-operation'>
            <Menu.Item key="layout" className='gym-layout-operation-item' onClick={this.handleLogout}>
                <Icon className='gym-layout-operation-item-icon' type={'tuichu'}/>
                <span>退出登录</span>
            </Menu.Item>
        </Menu>
    );
    /**
     * 商场
     */
    shop = () => (
        <Menu className='gym-layout-operation'>
            <Menu.Item key="J-shop" className='gym-layout-operation-item' onClick={this.goToPPS}>
                <span>金宝贝Shop</span>
            </Menu.Item>
            {
                User.businessSource.map(item => item.businessSourceCode).includes('75002')
                    ?
                    <Menu.Item key="X-shop" className='gym-layout-operation-item' onClick={this.goToSegmaPPS}>
                        <span>西格玛Shop</span>
                    </Menu.Item>
                    : null
            }
        </Menu>
    )
    /**
     * 跳转PPS
     */
    goToPPS = () => {
        ppsUrl({
            currentCenterId: User.currentCenterId
        }).then((res) => {
            if (res.url) {
                //使用window对象跳转新tab
                let win = window.open(res.url, 'about:blank');
                win.focus();
            }
        }, (err) => {
            Message.error(err.msg);
        })
    };
    /**
     * 跳转西格玛
     */
    goToSegmaPPS = () => {
        segmaPpsUrl({
            currentCenterId: User.currentCenterId
        }).then((res) => {
            if (res.url) {
                //使用window对象跳转新tab
                let win = window.open(res.url, 'about:blank');
                win.focus();
            }
        }, (err) => {
            Message.error(err.msg);
        })
    };

    render() {
        const {
            isDropdown, isFeedBackDropdown,
        } = this.state;
        return (
            <div id='gym-layout-header' className='gym-layout-header'>
                <div className='gym-layout-header-left'>
                    <div className='gym-layout-header-left-item pl15'>
                        <img className='gym-layout-header-left-item-logo' src={require(`@/images/newMate_logo.png`)}/>
                    </div>
                </div>
                <div className="gym-layout-header">
                    <div className='gym-layout-header-mid'>
                        <Utils/>
                        <NoReadNotice/>
                    </div>
                    <div className='gym-layout-header-right'>
                        <div
                            className='gym-layout-header-right-item'
                        >
                            <SearchInput onSearch={this.handleSearch}/>
                        </div>
                        <a href='http://wiki.gymbomate.com/display/ViewPoint'
                           className='gym-layout-header-right-item'
                           target='_blank'
                        >
                            <Icon className='gym-layout-header-icon' type='wenda'/>
                            <span>帮助</span>
                        </a>
                        {
                            CommonUtils.isInclude(User.role, [`CD`, 'GI', 'CS']) &&
                            (
                                <Dropdown
                                    overlay={this.shop()}
                                    trigger={['click']}
                                    onVisibleChange={this.visibleShop}
                                >
                                    <div className={`gym-layout-header-right-item pointer ${isFeedBackDropdown ? 'active' : ''}`}>
                                        <Icon className='gym-layout-header-icon' type='cart1'/>
                                        <span>Shop</span>
                                    </div>
                                </Dropdown>
                            )
                        }
                        <div className='gym-layout-header-right-item center-search'>
                            <Select
                                showSearch
                                onChange={this.handleChange}
                                optionFilterProp="children"
                                defaultValue={User.currentCenterId}
                            >
                                {
                                    (User.staffCenterList || []).map((item: any, index: number) => (
                                        <SelectOption key={`${index}`} title={item.centerName} value={item.id}>
                                            {`${item.centerCode}-${item.centerName}`}
                                        </SelectOption>
                                    ))
                                }
                            </Select>
                        </div>
                        <Dropdown
                            overlay={this.menu()}
                            trigger={['click']}
                            onVisibleChange={this.visibleChang}
                        >
                            <div className={`gym-layout-header-right-item pointer ${isDropdown ? 'active' : ''}`}>
                                <Icon className='gym-layout-header-icon' type='yonghu'/>
                                <span>{User.chineseName || ''}</span>
                            </div>
                        </Dropdown>

                    </div>
                </div>
            </div>
        )
    }
}

export {Header}
