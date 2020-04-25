export class Order {
    constructor(
                public id: string,
                public ownerId: string,
                public ownerName: string,
                public pickerId: string, 
                public pickerName: string,
                public products: {string: number}) {}
}