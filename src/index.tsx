/**
 * desc: 入口文件
 * User:
 * Date: 2018/7/26
 * Time: 下午3:28
 */
/// <reference path="./.h/global.d.ts" />

import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Provider} from 'react-redux';
import {store} from './saga/store';
import {Routers} from "./router/routers";
import moment from 'moment';
import {ErrorBoundary} from "@/ui/component/errorBoundary";

// 全局设置日期组件为中文
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <Provider store={store}>
            <ErrorBoundary>
                <Routers/>
            </ErrorBoundary>
        </Provider>
    </LocaleProvider>,
    document.getElementById("react-container"));
