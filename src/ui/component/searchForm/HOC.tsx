/**
 * desc:
 * Date: 2018/8/14
 * Time: 下午2:57
 */
import React from 'react';

const loadForm = (WrappedComponent) => (
    class extends React.Component<any> {
        input:any;
        render(){
            return(
                <WrappedComponent book={`222`} {...this.props}/>
            )
        }
    }
)
export default loadForm;
