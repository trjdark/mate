/**
 * Desc: React context 封装，跨组件传值
 * User: Debby.Deng
 * Date: 2018/10/17,
 * Time: 下午6:20
 */

import * as React from "react";

const Context=React.createContext({});

const Consumer=Context.Consumer;

class Provider extends React.Component<any,any>{
    render(){
        return (
            <Context.Provider value={this.props.value}>
                {this.props.children}
            </Context.Provider>
        )
    }
}
export {Provider,Consumer};
