import * as f from '../common/functions';

export class MemberStatus {
    id?: string;
    description?: string;

    constructor(id?:string, description?:string) {
        this.id = (id) ? id : '';
        this.description = (description) ? description : '';
    }

    public static clone(model: MemberStatus): MemberStatus {
        return f.clone(model);
    }

    public static TableName: string = 'memberStatus';

    public static MemberStatusFields: object = { text: 'description', value: 'id' };

    public static setData(model: MemberStatus): any {
    return {
        id: ((model.id) ? model.id.toUpperCase() : ''), 
        description: ((model.description) ? model.description.toUpperCase() : ''), 
        };
    }
}