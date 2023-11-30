import {CustomerApi} from "@/api/customerApi";
import {SetApi} from '@/api/settingApi';
import {Fetch} from "@/service/fetch";
import {Events} from "@/events/events";
import {call, put} from "redux-saga/effects";

export function* getClient360BasicInfo(action) {
  const params = {
      url: CustomerApi.客户360基本信息,
      data: action.params
  };
  try{
      const response = yield call(Fetch.post.bind(Fetch), params);
      yield put({
        type: Events.GET_CLIENT_360_BASIC_INFO,
        data: response
      });
  }catch (e) {}
}

export function* getClient360BaByInfo(action) {
  const params={
    url: CustomerApi.客户360宝宝信息,
    data: action.params
  }
  try{
    const response = yield call(Fetch.post.bind(Fetch), params);
    yield put({
      type: Events.GET_CLIENT_360_BABY_INFO,
      data: response
    });
  }catch (e) {}
}

export function* getCodeInfoByTypeRedux(action) {
  const params={
    url:SetApi.根据类型获取字典数据,
    data:action.params
  }
  try {
    const response = yield call(Fetch.post.bind(Fetch), params);
    yield put({
      type: Events.GET_CODE_INFO_BY_TYPE,
      data: response
    });
  }catch (e) {}
}

export function * queryEditPermmision(action) {
    const params = {
        url: CustomerApi.基本信息是否可编辑,
        data: action.params
    };
    try {
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.GET_EDIT_PERMISSION,
            data: response
        })
    }catch (e) {

    }
}
