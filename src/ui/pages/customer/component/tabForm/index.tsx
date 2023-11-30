/**
 * desc: tab表单，使用参考/ui/customer/index
 * User: zhang
 * Date: 2018/9/26
 * Time: 下午2:23
 */
import React from 'react';
import { Tabs } from 'antd';
import './index.scss'

const TabPane = Tabs.TabPane;

class ExtraContent extends React.Component<any,any> {
    constructor(props:any){
        super(props)
    };

    render(){
        return(
            <div onClick={this.props.add} className="extra-add">+ 新增</div>
        )
    }
}

function tabFormWrapper (WrappedComponent,{title}) {

    class tabForm extends React.Component<any,any> {
        newTabIndex:any;
        constructor(props) {
          super(props);

          let panes = [{
              title:title,
              content:<WrappedComponent {...this.props} initData={null} tabKey='1' onTitleChange={this.onTitleChange} />,
              key: '1',
          }];

          let activeKey = panes[0].key;

          this.newTabIndex = (panes.length+1);
          this.state = {activeKey,panes};
        }

        onTitleChange = (obj) => {
            const panes = this.state.panes.map(pane=>{
                if (pane.key === obj.key) {
                    pane.title = obj.value
                    return pane;
                } else {
                    return pane
                }
            });
            this.setState({ panes });
        }

        onChange = (activeKey) => {
          this.setState({ activeKey });
        }

        onEdit = (targetKey, action) => {
          this[action](targetKey);
        }

        add = () => {
          const panes = this.state.panes;

          // 不超过15个
          if (panes.length>=15) return;

          const activeKey = `${this.newTabIndex++}`;
          panes.push({
              title:title,
              content: <WrappedComponent {...this.props} tabKey={activeKey} onTitleChange={this.onTitleChange}/>,
              key: activeKey
          });
          this.setState({ panes, activeKey });
        }

        remove = (targetKey) => {
            if (this.state.panes.length===1) return;
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
            this.setState({ panes, activeKey });
        }

        render () {
            return (
                <div className={`component-gym-tab-form`} style={this.props.style}>
                    <Tabs
                      onChange={this.onChange}
                      activeKey={this.state.activeKey}
                      type="editable-card"
                      onEdit={this.onEdit}
                      hideAdd={true}
                      tabBarExtraContent={<ExtraContent add={this.add}/>}
                    >
                      {this.state.panes.map(pane =>
                          <TabPane tab={pane.title} key={pane.key} closable={this.state.panes.length > 1 ? pane.closable : false}>
                              {pane.content}
                          </TabPane>
                      )}
                    </Tabs>
                </div>
            )
        }
    }

    return tabForm;
}

export {tabFormWrapper}
