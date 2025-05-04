import * as f from '../common/functions';

export class MembershipUser {
    name?: string;
    memberId?: string;
    userType?: number;

    constructor(name?:string, memberId?:string, userType?:MembershipUserType) {
        this.name = (name) ? (name.toUpperCase()) : '';
        this.memberId = (memberId) ? memberId : '';
        this.userType = (userType) ? userType : MembershipUserType.New;
    }

    public static clone(model: any): MembershipUser {
        return f.clone(model);
    }

    public static TableName = 'membershipUsers';
  
    public static setData(model: MembershipUser): any {
        return {
            name: ((model.name) ? (model.name.toUpperCase()) : ''), 
            memberId: ((model.memberId) ? model.memberId : 0),
            userType: ((model.userType) ? model.userType : 0),
        };
    }
}

export enum MembershipUserType {
    New = 0,
    Member = 1,
    Treasurer = 2,
    Geneologist = 3,
    Administrator = 4
}  