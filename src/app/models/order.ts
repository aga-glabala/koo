import { Action } from './action';
import { Product } from './product';

export class Order {
    constructor(
                public id: string,
                public ownerId: string,
                public ownerName: string,
                public pickerId: string,
                public pickerName: string,
                public actionId: string,
                public paid: number,
                public picked: boolean,
                public products: {string: number}, // {productid: count}
                public action: Action) {}

    /*
    discount - value in percentage (ie 30 for 30%)
    modifier - value that should be added to final price (ie shipment costs)
    */
    public countSum(products: Product[], discount = 0, modifier = 0) {
        let sum = 0;
        for (const product of products) {
            sum += this.products[product.id] ? product.price * this.products[product.id] : 0;
        }

        sum = Math.ceil(sum - sum * discount / 100) + modifier;
        return sum;
    }
}

export class UserOrder {
    constructor(public action: Action,
                public order: Order) {}

    public countSum(products: Product[], discount = 0, modifier = 0) {
        return this.order.countSum(products, discount, modifier);
    }
}
