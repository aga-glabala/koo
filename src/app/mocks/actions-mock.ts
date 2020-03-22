import { Action } from '../models/action';

export const ACTIONS: Action[] = [{
    id: '1',
    name: 'Kremy',
    photoUrl: 'http://placehold.it/200x200',
    createdBy: undefined,
    orderDate: new Date('2020-03-28'),
    payDate: new Date('2020-03-28'),
    collectionDate: new Date('2020-03-29'),
    rules: 'Lorem ipsum',
    description: 'Lorem ipsum',
    collection: 'Lorem ipsum',
    bankAccount: '233243523432535436463454',
    helpers: 'Tu będą linki do osób które coś pomagają z opisem co zrobiły',
    products: []
},{
    id: '2',
    name: 'Pomidory',
    photoUrl: 'http://placehold.it/200x200',
    createdBy: undefined,
    orderDate: new Date('2020-04-02'),
    payDate: new Date('2020-04-02'),
    collectionDate: new Date('2020-04-04'),
    rules: 'Lorem ipsum',
    description: 'Lorem ipsum',
    collection: 'Lorem ipsum',
    bankAccount: '233243523432535436463454',
    helpers: 'Tu będą linki do osób które coś pomagają z opisem co zrobiły',
    products: []
},];