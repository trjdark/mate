/**
 * desc: 合同模块，相关数据结构
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/13
 * Time: 下午3:06
 */
declare interface basicContractInfo {
    contractId: string;
    contractCode: string;
    contractType: string;
    birthday: number;
    monthAge: number;
    babyName: string;
    packageName: string;
    packageType: "0" | "1";
    contractStatus:  '18001' | '18002' | '18003' | '18004' | '18005' ;
    totalCoursePrice: number;
    totalCourseNum: number;
    reallyFreeCourseNum:number;
    reallyAfterDiscountPrice: number;
    remainingFreeCourseNum: number;
    remainingCourseNum:number;
    remainingCoursePrice:number;
    registeredFee:number;
    signTime: number;
    customerCode: string;
    approvalStatus: "19002" | "19004" | "19005" | "19006";
    paymentStatus: "20001" | "20002" | "20003" | "20004";
    effectiveTime: number;
    endTime: number;
    centerId: string;
    centerName: string;
    centerCode:string;
    gbstaffname: string;
    gastaffname: string;
    freeGiftUsedInfoList: Array<any>;
    remark: string;
    records:Array<any>;
    periodOfValidity: string;
    businessSource:string;
    relatedContracts:Array<any>;
    legalGuardianName:string;
    electronicFlag:number;
    salesStaffName:string;
    hasBindingContract?:number;
    bindingActualPrice?:number;
    actualTotalPrice?:number;
    bindingContractMonth?:number;
    leadsId?:string
}
