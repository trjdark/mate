/**
 * desc: 合同页面触发事件
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/9
 * Time: 上午11:37
 */
import {CustomerApi} from "../api/customerApi";
import {Fetch} from "../service/fetch";
import {SetApi} from "../api/settingApi";
import {ContractApi} from "../api/contractApi";
import {ServiceActionEnum} from "@redux-actions/serviceActionsEnum";
import {message} from "antd";
import {downloadExcel} from "@redux-actions/report/downloadExcel";
import {fileDownload} from "@redux-actions/customer/batchImport";
import { User } from "@/common/beans/user";
import {Loading} from '@/ui/component/loading'

/**
 * 合同模块初始化
 * @returns {{type: ServiceActionEnum}}
 */
export const contractInit = () => {
    return {
        type: ServiceActionEnum.合同模块初始化,
    }
};

/**
 * 获取leads信息（宝宝名称，月龄，合同状态）
 * @param params
 */
export const getleadInfo = (params:any):Promise<any> => {
    const param = {
        url: CustomerApi.leads状态及合同,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            let babyNames = [];
            let monthValues = [];
            (res.babyInfos || []).forEach((item:any) => {
                babyNames = [ ...babyNames, item.babyName];
                monthValues = [...monthValues, item.monthValue];
            } );
            return Promise.resolve({
                babyNames: babyNames.join('/'),
                monthValues: monthValues.join('/'),
                hasContract: !!res.hasValidContract,
                gb: res.gb
            })
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 根据课程包类型，获取课程包列表
 * @param params
 * @returns {Promise<any>}
 */
export const getCourseListByCourseType = (params:any):Promise<any> => {
    const param = {
        url: SetApi.根据课程包类型获取中心课程包列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 创建合同
 * @param params
 * @returns {Promise<any>}
 */
export const creatContract = (params:any, submitRequestId:string):Promise<any> => {
    const param = {
        url: ContractApi.创建合同,
        data: params,
        header: {
            submitRequestId: submitRequestId
        }
    }
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 新建合同保存附件
 * @param params
 * @returns {Promise<any>}
 */
export const saveAttachment = (params: any): Promise<any> => {
    const param = {
        url: ContractApi.查看合同保存附件,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        }, (err: any) => {
            return Promise.reject(err)
        })
};
/**
 * 新建合同校验宝宝个数（是否可选电子合同）
 * @param params
 * @returns {Promise<any>}
 */
export const getBabyByleads = (params: any): Promise<any> => {
    const param = {
        url: ContractApi.新建合同获取leads下宝宝个数,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        }, (err: any) => {
            return Promise.reject(err)
        })
};
/**
 * 新建合同校验信息
 * @param params
 * @returns {Promise<any>}
 */
export const checkBabyInfo = (params: any): Promise<any> => {
    const param = {
        url: ContractApi.新建合同校验信息,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        }, (err: any) => {
            return Promise.reject(err)
        })
};
/**
 * 获取合同列表
 * @param params
 */
export const getContractList = (params:any) => {
    const param = {
        url: ContractApi.合同列表,
        data: params,
    }
    return Fetch.post(param);
};

/**
 * 获取合同详情
 * @param params
 * @returns {Promise<any>}
 */
export const getContractInfo = async (params:any, type = false):Promise<any> => {
    if(type){
        try{
            return await Promise.all([
                getContractDetail(params),
                getContractUsed(params),
                getContractLeaveList(params),
                contractCancelClassList(params),
                contractChangeCenterListByUsage(params),
                contractChangePkgList(params),
                contractGiveClassList(params),
                contractDelayList(params),
                checkContractOper(params),
                getContractRealAmount(params),
                getContractReviseList(params),
                getPartRefundList(params),
            ]).then((res:any) => {
                return Promise.resolve({
                    detail: res[0],
                    usageDetail: res[1],
                    leaveList: res[2],
                    cancelList: res[3],
                    changeCenterList: res[4],
                    changePkgList: res[5],
                    freeList: res[6],
                    delayList: res[7],
                    isOper:res[8],
                    courseInfo: res[9],
                    reviseList: res[10],
                    partRefundList: res[11]
                })
            });
        }catch (e) {

        }
    }else{
        try{
            return await Promise.all([
                getContractDetail(params),
            ]).then((res:any) => {
                return Promise.resolve({
                    detail: res[0],
                })
            });
        }catch (e) {

        }
    }
};
/**
 * 查询合同实际价格（包括全转合同）
 * @param params
 * @returns {Promise<any>}
 */
const getContractRealAmount = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.查询合同实际价格,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 检查合同是否存在未完成操作
 * @param params
 * @returns {Promise<any>}
 */
const checkContractOper = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.检查合同是否存在未完成操作,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 获取合同数据（带lead信息）
 * @param params
 * @returns {Promise<any>}
 */
export const getContractDetailInfo = async (params:any):Promise<any> => {
    const contract = await getContractDetail(params);
    const lead = await getleadInfo(Object.assign({}, params, {leadsId: contract.leadsId}));
    return Promise.resolve({
        contract: contract,
        lead: lead
    })

}

// 合同基本信息
export const getContractDetail = (params:any, slience = false):Promise<any> => {
    const param = {
        url: ContractApi.合同详情,
        data: params,
        slience: slience
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

// 合同请假列表
const getContractLeaveList = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.合同请假次数列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
}
// 合同使用情况
export const getContractUsed = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.合同使用情况,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        }, (err: any) => {
            return Promise.reject(err)
        })
}
/**
 * 中心可否选择电子合同
 * @param params
 * @returns {Promise<any>}
 */
export const isSelectContract = (params: any): Promise<any> => {
    const param = {
        url: ContractApi.中心可否选择电子合同,
        data: params
    }
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        }, (err: any) => {
            return Promise.reject(err)
        })
};
/**
 * 修改合同
 * @param params
 * @returns {Promise<any>}
 */
export const updateContract = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.修改合同,
        data: params
    }
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 删除合同
 * @param params
 * @returns {{}}
 */
export const deleteContract = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.删除合同,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })

};
/**
 * 审批合同
 * @param params
 * @returns {Promise<any>}
 */
export const approveContract = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.审批合同,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 作废合同
 * @param params
 * @returns {Promise<any>}
 */
export const invalidContract = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.作废合同,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            message.success("操作成功");
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 申请请假
 * @param params
 * @returns {Promise<any>}
 */
export const createLeave = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.申请请假,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            message.success("操作成功");
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 合同请假列表
 * @param params
 * @returns {Promise<any>}
 */
export const contractLeaveList = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.合同请假次数列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 删除请假流程
 * @param params
 * @returns {Promise<any>}
 */
export const deleteLeave = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.删除请假申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 获取请假详情
 * @param params
 * @returns {Promise<any>}
 */
export const getLeaveApplyDetail = async (params:any):Promise<any> => {
    try{
        const leave = await getLeaveDetail(params);
        const contract = await getContractDetail(params);
        return Promise.resolve({
            contractDetail:contract,
            leaveDetail: leave
        })
    }catch (err) {
        return Promise.reject(err)
    }
};
// 获取请假信息
const getLeaveDetail = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.获取请假申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
}
/**
 * 审批请假申请
 * @param params
 * @returns {Promise<any>}
 */
export const approveLeave = (params:any):Promise<any> => {

    const param = {
        url: ContractApi.审批请假申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};



/**
 * 修改请假申请
 * @param params
 * @returns {Promise<any>}
 */
export const updateLeave = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.修改请假申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 申请赠课
 * @param params
 * @returns {Promise<any>}
 */
export const createGiveClass = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.申请赠课,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            message.success("操作成功");
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 申请延期
 * @param params
 * @returns {Promise<any>}
 */
export const createDelay = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.申请延期,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            message.success("操作成功");
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 获取延期申请详情
 * @param params
 * @returns {Promise<any>}
 */
export const getDelayApplyDetail = async (params:any):Promise<any> => {
    try{
        const delay = await getDelayDetail(params);
        const contract = await getContractDetail(params);
        return Promise.resolve({
            contractDetail:contract,
            delayDetail: delay
        })
    }catch (err) {
        return Promise.reject(err)
    }
};
// 获取延期信息
const getDelayDetail = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.获取延期申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
}


/**
 * 修改延期申请
 * @param params
 * @returns {Promise<any>}
 */
export const updateDelay = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.修改合同延期申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};


/**
 * 过期合同列表
 * @param params
 * @returns {Promise<any>}
 */
export const contractExpireList = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.过期合同列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 过期合同列表
 * @param params
 * @returns {Promise<any>}
 */
export const exportContractExpireList = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.导出过期合同列表,
        data: params,
        responseType: 'arraybuffer'
    };
    return Fetch.post(param, 30000).then((res:any) => {
        let link = document.createElement('a');
        link.download = `过期合同列表.xlsx`;
        link.style.display = 'none';
        link.href = URL.createObjectURL(new Blob([res]));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
    });
};


/**
 * 确认合同收入
 * @param params
 * @returns {Promise<any>}
 */
export const ensureContract = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.确认合同收入,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 转中心列表
 * @param params
 * @returns {Promise<any>}
 */
export const contractChangeCenterList = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.转中心列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 转中心列表(精确查找)
 * @param params
 * @returns {Promise<any>}
 */
export const contractChangeCenterListByUsage = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.转中心列表精确查找,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 创建转中心申请
 * @param params
 * @returns {Promise<any>}
 */
export const createChangeCenter = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.创建转中心申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 删除转中心申请详情
 * @param params
 * @returns {Promise<any>}
 */
export const deleteChangeCenter = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.删除转中心申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            message.success("操作成功");
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 撤回转中心申请详情
 * @param params
 * @returns {Promise<any>}
 */
export const transferOutRetractChangeCenter = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.撤出转中心申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            message.success("操作成功");
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 撤回转中心申请详情
 * @param params
 * @returns {Promise<any>}
 */
export const transferInRetractChangeCenter = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.撤入转中心申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            message.success("操作成功");
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 撤回转中心申请详情
 * @param params
 * @returns {Promise<any>}
 */
export const transferOutNewRetractChangeCenter = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.撤出转中心申请2,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            message.success("操作成功");
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
// 获取转中心信息
export const getChangeCenterDetail = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.获取转中心申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve({
                contractDetail: res.contract,
                changeCenterCourseDetail: res
            })
        }, (err:any) => {
            return Promise.reject(err)
        })
}

/**
 * 审批转中心申请
 * @param params
 * @returns {Promise<any>}
 */
export const approvalChangeCenter = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.审批转中心申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 修改退课
 * @param params
 * @returns {Promise<any>}
 */
export const updateChangeCenter = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.修改转中心申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};



/**
 * 退课列表
 * @param params
 * @returns {Promise<any>}
 */
export const contractCancelClassList = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.退课列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 申请退课
 * @param params
 * @returns {Promise<any>}
 */
export const createCancelClass = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.申请退课,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            message.success("操作成功");
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};


/**
 * 获取退课详情
 * @param params
 * @returns {Promise<any>}
 */
export const getOutApplyDetail = async (params:any):Promise<any> => {
    try{
        const outCourse = await getOutDetail(params);
        const contract = await getContractDetail(params);
        return Promise.resolve({
            contractDetail:contract,
            outCourseDetail: outCourse
        })
    }catch (err) {
        return Promise.reject(err)
    }
};
// 获取退课信息
const getOutDetail = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.获取退课申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
}


/**
 * 删除退课申请
 * @param params
 * @returns {Promise<any>}
 */
export const cancelCancelClass = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.删除退课申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            message.success("操作成功");
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 修改退课
 * @param params
 * @returns {Promise<any>}
 */
export const updateReturnCourse = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.修改退课申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 审批退课申请
 * @param params
 * @returns {Promise<any>}
 */
export const approvalRefund = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.审批退课申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 创建修改课程包
 * @param params
 * @returns {Promise<any>}
 */
export const createChangePkg = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.申请改课程包,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            message.success("操作成功");
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 改课程包申请列表
 * @param params
 * @returns {Promise<any>}
 */
export const contractChangePkgList = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.改包申请列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};


/**
 * 获取改包详情
 * @param params
 * @returns {Promise<any>}
 */
export const getChangePkgApplyDetail = async (params:any):Promise<any> => {
    try{
        const changePkg = await getChangePkgDetail(params);
        const contract = await getContractDetail(params);
        const course = await getContractRealAmount(params);
        return Promise.resolve({
            contractDetail:contract,
            changePkgDetail: changePkg,
            course: course
        })
    }catch (err) {
        return Promise.reject(err)
    }
};
// 获取改包信息
const getChangePkgDetail = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.获取改包申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
}


/**
 * 修改改包申请
 * @param params
 * @returns {Promise<any>}
 */
export const updateChangePkg = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.修改改包申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 删除改包申请
 * @param params
 * @returns {Promise<any>}
 */
export const deleteChangePkg = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.删除改包申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 审批改包申请
 * @param params
 * @returns {Promise<any>}
 */
export const approvalChangePkg = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.审批改包申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};


/**
 * 合同延期申请列表
 * @param params
 * @returns {Promise<any>}
 */
export const contractDelayList = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.合同延期申请列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 删除延期申请列表
 * @param params
 * @returns {Promise<any>}
 */
export const deleteDelay = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.删除合同延期申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 审批延期申请
 * @param params
 * @returns {Promise<any>}
 */
export const approveDelay = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.审批延期申请,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 赠课申请列表
 * @param params
 * @returns {Promise<any>}
 */
export const contractGiveClassList = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.赠课列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 审批赠课申请
 * @param params
 * @returns {Promise<any>}
 */
export const approveFreeCourse = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.审批赠课,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 获取赠课详情
 * @param params
 * @returns {Promise<any>}
 */
export const getFreeCourseApplyDetail = async (params:any):Promise<any> => {
    try{
        const freeCourse = await getFreeCourseDetail(params);
        const contract = await getContractDetail(params);
        return Promise.resolve({
            contractDetail:contract,
            freeCourseDetail: freeCourse
        })
    }catch (err) {
        return Promise.reject(err)
    }
};
// 获取赠课信息
const getFreeCourseDetail = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.赠课详情,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
}

/**
 * 删除赠课
 * @param params
 * @returns {Promise<any>}
 */
export const deleteFreeCourse = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.删除赠课,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 作废赠课
 * @param params
 * @returns {Promise<any>}
 */
export const cancelFreeCourse = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.作废赠课,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 修改赠课
 * @param params
 * @returns {Promise<any>}
 */
export const updateFreeCourse = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.修改赠课,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};


/**
 * 获取申请请假次数的基本信息
 * @param params
 * @returns {Promise<any>}
 */
export const getLeaveBasicInfo = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.获取退课申请基本信息,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 创建赠课申请所需基本信息
 * @param params
 * @returns {Promise<any>}
 */
export const getFreeCourseRecordInfo = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.创建赠课获取基本,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 创建延期申请所需基本信息
 * @param params
 * @returns {Promise<any>}
 */
export const getDelayInfoForCreate = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.创建延期获取基本,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 查询退课剩余课时不包含赠课课时
 * @param params
 * @returns {Promise<any>}
 */
export const getContractOutRemainingCourseCount = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.查询退课剩余课时不包含赠课课时,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 检查临转中心列表
 * @param params
 * @returns {Promise<any>}
 */
export const checkGetRollInCenter = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.检查临转中心列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 获取支付
 * @param params
 * @returns {Promise<any>}
 */
export const getPaymentList = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.获取支付流水列表,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 根据业务来源获取关联合同
 * @param params
 * @returns {Promise<any>}
 */
export const getRelatedContract = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.获取关联合同,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 导出流水明细
 * @param data
 */
export const downloadPaymentExcel = data => {
    downloadExcel(data, ContractApi.导出支付流水, '线上订单交易明细.xlsx');
};

/**
 * 获取宝宝是否存在优先级合同
 * @param data
 */
export const getPriority = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.获取宝宝是否存在优先级合同,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
/**
 * 获取西格玛中心列表
 * @param data
 */
export const getSigmaCenter = (params: any): Promise<any> => {
    const param = {
        url: ContractApi.获取西格玛转中心列表,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        }, (err: any) => {
            return Promise.reject(err)
        })
};

/**
 * 设置合同优先级
 * @param data
 */
export const settingPriority = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.设置合同优先级,
        data: params
    };
    return Fetch.post(param)
};
export const downloadFile = async params => {
    Loading.add()
    const data = {fileId:params.fileId,currentCenterId:User.currentCenterId}
    try {
       await fileDownload(data, SetApi.多类型文件下载, params.fileName);
       Loading.remove()
    } catch {
        Loading.remove()
    }
}

/**
 * 申请特殊调整
 * @param params
 * @returns {Promise<any>}
 */
export const createRevise = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.申请特殊调整,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            message.success("操作成功");
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 查询合同调整列表（包括全转合同）
 * @param params
 * @returns {Promise<any>}
 */
const getContractReviseList = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.查询合同调整列表,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 查询合同调整列表（包括全转合同）
 * @param params
 * @returns {Promise<any>}
 */
export const getContractReviseListFromCenter = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.查询中心合同调整列表,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 查询合同调整详情（
 * @param params
 * @returns {Promise<any>}
 */
export const getContractReviseDetail = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.查询中心合同调整详情,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 取消合同调整详情
 * @param params
 * @returns {Promise<any>}
 */
export const cancelContractRevise = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.取消合同调整详情,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 审批合同调整详情
 * @param params
 * @returns {Promise<any>}
 */
export const approveContractReviseDetail = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.审批合同调整详情,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 导出
 * @param params
 * @returns {Promise<any>}
 */
export const exportContractReviseListFromCenter = (params:any) => {
    const data = {
        url: ContractApi.导出中心合同调整列表,
        data: params,
        responseType: 'arraybuffer'
    };
    return Fetch.post(data).then((res:any) => {
        let link = document.createElement('a');
        link.download = `合同调整列表.xlsx`;
        link.style.display = 'none';
        link.href = URL.createObjectURL(new Blob([res]));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
    });
};
/**
 * 创建部分退费
 * @param params
 * @returns {Promise<any>}
 */
export const createPartRefunc = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.新增部分退费,
        data: params
    };
    return Fetch.post(param);
};
/**
 *
 * @param params
 * @returns {Promise<any>}
 */
export const getPartRefundList = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.查询合同新增部分退费列表,
        data: params
    };
    return Fetch.post(param);
};
/**
 *
 * @param params
 * @returns {Promise<any>}
 */
export const getPartRefundDetail = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.查询合同部分退费详情,
        data: params
    };
    return Fetch.post(param);
};
/**
 *
 * @param params
 * @returns {Promise<any>}
 */
export const payPartRefund = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.付款部分退费,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 导出
 * @param params
 * @returns {Promise<any>}
 */
export const exportContractPartRefundListFromCenter = (params:any) => {
    const data = {
        url: ContractApi.导出中心部分退费列表,
        data: params,
        responseType: 'arraybuffer'
    };
    Fetch.post(data).then((res:any) => {
        let link = document.createElement('a');
        link.download = `部分退费列表.xlsx`;
        link.style.display = 'none';
        link.href = URL.createObjectURL(new Blob([res]));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
    });
};
