import * as f from '../common/functions';

export class Setup {
    duesYear?:number;
    membershipChairEmail?:string;
    holmsEmail?:string;
    appTitle?:string;
    appSubTitle?:string;
    nextMemberNo?:number;
    regEmailMessage?:string;
    newRegDisplayMessage?:string;
    nextCashEntryReceiptNo?:number;
    nextCashEntryBatchNo?:number;

    constructor(
        duesYear?:number,
        membershipChairEmail?:string,
        holmsEmail?:string,
        appTitle?:string,
        appSubTitle?:string,
        nextMemberNo?:number,
        regEmailMessage?:string,
        newRegDisplayMessage?:string,
        nextCashEntryReceiptNo?:number,
        nextCashEntryBatchNo?:number
    ) {
        this.duesYear = (duesYear) ? duesYear : new Date().getFullYear();
        this.membershipChairEmail = (membershipChairEmail) ? membershipChairEmail : '';
        this.holmsEmail = (holmsEmail) ? holmsEmail : '';
        this.appTitle = (appTitle) ? appTitle : '';
        this.appSubTitle = (appSubTitle) ? appSubTitle : '';
        this.nextMemberNo = (nextMemberNo) ? nextMemberNo : 0;
        this.regEmailMessage = (regEmailMessage) ? regEmailMessage : '';
        this.newRegDisplayMessage = (newRegDisplayMessage) ? newRegDisplayMessage : '';
        this.nextCashEntryReceiptNo = (nextCashEntryReceiptNo) ? nextCashEntryReceiptNo : 0;
        this.nextCashEntryBatchNo = (nextCashEntryBatchNo) ? nextCashEntryBatchNo : 0;
    }

    public static clone(model: Setup): Setup {
        return f.clone(model);
    }

    public static TableName = 'setup';

    public static setData(model:Setup): any {
        return {
            duesYear : ((model.duesYear) ? model.duesYear : new Date().getFullYear()),
            membershipChairEmail : ((model.membershipChairEmail) ? model.membershipChairEmail : ''),
            holmsEmail : ((model.holmsEmail) ? model.holmsEmail : ''),
            appTitle : ((model.appTitle) ? model.appTitle : ''),
            appSubTitle : ((model.appSubTitle) ? model.appSubTitle : ''),
            nextMemberNo : ((model.nextMemberNo) ? model.nextMemberNo : 0),
            regEmailMessage : ((model.regEmailMessage) ? model.regEmailMessage : ''),
            newRegDisplayMessage : ((model.newRegDisplayMessage) ? model.newRegDisplayMessage : ''),
            nextCashEntryReceiptNo : ((model.nextCashEntryReceiptNo) ? model.nextCashEntryReceiptNo : 0),
            nextCashEntryBatchNo : ((model.nextCashEntryBatchNo) ? model.nextCashEntryBatchNo : 0),
        };
    }
}
