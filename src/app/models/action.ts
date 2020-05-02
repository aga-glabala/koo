import { Person, Helper } from './person';
import { Product } from './product';

export class Action {

    constructor(public id: string,
                public name: string,
                public photoUrl: string,
                public createdBy: Person,
                public createdOn: Date,
                public orderDate: Date,
                public payDate: Date,
                public payLock: boolean,
                public collectionDate: Date,
                public rules: string,
                public description: string,
                public collection: string,
                public payment: string,
                public productsEditable: boolean,
                public helpers: Helper[], 
                public products: Product[],
                public customFields: ProductField[]
                ) {}
}

export class ProductField {
    constructor(public id : string, 
                public name: string) {}
}