/**
 * desc:
 * Date: 2018/7/30
 * Time: 上午11:44
 */

import {createStore, applyMiddleware} from "redux";
import createSagaMiddleware from 'redux-saga';
import {composeWithDevTools} from 'redux-devtools-extension'; // 连接控制台redux调试工具
import reducers from './reducer/index';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
let store: any = null;

if (process.env.NODE_ENV === 'develop') {
    store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(sagaMiddleware)));
} else {
    store = createStore(reducers, {}, applyMiddleware(sagaMiddleware));
}

sagaMiddleware.run(rootSaga);

export {store};
