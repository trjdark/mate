/**
 * Desc:
 * User: dave.zhang
 */
import React from 'react';


class Login extends React.Component<any, any> {
    constructor(props) {
        super(props);
        window.location.href = process.env.home_Url;
    }
    render() {
        return (
            <div id='gym-login'>

            </div>
        )
    }
}

export {Login};
