import {CustomerApi} from "@/api/customerApi";
import {Fetch} from "@/service/fetch";
import {Events} from "@/events/events";
import {call, put} from "redux-saga/effects";

export function* getAssignRecordList(action) {
    const params = {
        url: CustomerApi.获取分配记录列表,
        data: action.params
    };
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        const list=response && response.list;
        const pager=response && {
            pageNo:response.pageNo,
            pageSize:response.pageSize,
            totalNo:response.totalNo,
            totalSize:response.totalSize
        };
        yield put({type: Events.GET_ASSIGN_RECORD_LIST, data: {list,pager}});
    }catch (e) {

    }
}