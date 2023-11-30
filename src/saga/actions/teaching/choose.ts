/**
 * Desc:
 * User: dave.zhang
 */
import {put} from "redux-saga/effects";
import {Events} from "../../../events/events";

export function* submitSelectionToReservation(action:any){
    try {
        yield put({
            type: Events.SELECTION_TO_RESERVATION,
            data: action.params
        })
    }catch (e) {

    }
}
