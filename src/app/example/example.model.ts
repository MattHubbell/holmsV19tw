import * as f from '../common/functions';

export class Example {
    annualName?: string;
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;

    constructor(
        annualName?: string,
        street1?: string,
        street2?: string,
        city?: string,
        state?: string,
        zip?: string,
    ) {
        this.annualName = (annualName) ? annualName : '';
        this.street1 = (street1) ? street1.toUpperCase() : '';
        this.street2 = (street2) ? street2.toUpperCase() : '';
        this.city = (city) ? city.toUpperCase() : '';
        this.state = (state) ? state.toUpperCase() : '';
        this.zip = (zip) ? zip.toUpperCase() : '';
    }

    public static clone(model: Example): Example {
        return f.clone(model);
    }

    public static TableName: string = 'example';

    public static setData(model: Example): any {
        return {
            annualName : ((model.annualName) ? model.annualName : ''),
            street1 : ((model.street1) ? model.street1.toUpperCase() : ''),
            street2 : ((model.street2) ? model.street2.toUpperCase() : ''),
            city : ((model.city) ? model.city.toUpperCase() : ''),
            state : ((model.state) ? model.state.toUpperCase() : ''),
            zip : ((model.zip) ? model.zip.toUpperCase() : ''),
        };
    }
}
