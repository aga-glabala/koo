import { Person, Helper } from './person';
import { Product } from './product';
import { Moment } from 'moment';

export class Action {

    constructor(public id: string,
                public name: string,
                public photoUrl: string,
                public createdBy: Person,
                public createdOn: Moment,
                public orderDate: Moment,
                public payDate: Moment,
                public payLock: boolean,
                public collectionDate: Moment,
                public rules: string,
                public description: string,
                public collection: string,
                public payment: string,
                public productsEditable: boolean,
                public helpers: Helper[],
                public products: Product[],
                public photos: string[],
                public customFields: ProductField[]
                ) {}
}

export class ProductField {
    constructor(public id: string,
                public name: string) {}
}

export class HelpingAction {
    constructor(public action: Action,
                public helpers: Helper[]) {}

    printDescriptions(): string {
        let text = '';
        for (let i = 0; i < this.helpers.length; i++) {
            text += this.helpers[i].description;
            if (i < this.helpers.length - 1) {
                text += ', ';
            }
        }
        return text;
    }
}
