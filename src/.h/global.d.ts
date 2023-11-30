import {Routes} from "@/router/enum/routes";

/**
 * desc:
 * User:
 * Date: 2018/7/30
 * Time: 上午11:32
 */
declare interface breadCrumbRoute {
    name: string;
    path: string;
    id: string;
    link: string;
}

// action的数据结构
declare interface Action {
    type:string | number;
    [propName:string]:any
}
