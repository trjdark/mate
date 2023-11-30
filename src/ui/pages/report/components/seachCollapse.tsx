/**
 * desc: 高级搜索外框
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/21
 * Time: 上午10:38
 */
import React, {Component} from 'react';
import {Button, Collapse} from 'antd';

// 解构出二级组件，方便调用
const {Panel} = Collapse;

class SearchCollapse extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            collapseStatus: true,   // 默认为true，面板展开，放面板收起时，设置为false
        }
    }

    render() {
        const {collapseStatus} = this.state;
        const {handleSearch, handleReset} = this.props;
        return (
            <div className="page-wrap gym-report-wrap">
                <Collapse
                    defaultActiveKey={['search-form']}
                    onChange={this.handleSwitchPanel}
                >
                    <Panel
                        header={
                            <div className="gym-panel-header">
                                <p>高级搜索</p>
                                <p>{collapseStatus ? '收起' : '展开'}</p>
                            </div>
                        }
                        key="search-form"
                    >
                        {this.props.children}
                        <div className="gym-report-search">
                            <Button
                                className="gym-button-blue gym-button-xs"
                                onClick={handleSearch}
                            >
                                查询
                            </Button>
                            <Button
                                className='gym-button-xs gym-button-wBlue ml15'
                                onClick={handleReset}
                            >
                                重置
                            </Button>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }

    handleSwitchPanel = (key) => {
        this.setState({
            collapseStatus: !!(key.length > 0)
        })
    }
}

export default SearchCollapse;
