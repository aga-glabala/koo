import { Person } from './person';
import { Product } from './product';

export class Action {

    constructor(public id: string,
                public name: string,
                public photoUrl: string,
                public createdBy: Person,
                public orderDate: Date,
                public payDate: Date,
                public collectionDate: Date,
                public rules: string,
                public description: string,
                public collection: string,
                public bankAccount: string,
                public helpers: string, // TODO para {osoba, opis}
                public products: Product[]
                ) {}
}