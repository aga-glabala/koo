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
                public products, // {productid: count}
                public action: Action) {}
    public countSum(products: Product[]) {
        let sum = 0;
        for (const product of products) {
            sum += this.products[product.id] ? product.price * this.products[product.id] : 0;
        }
        return sum;
    }
}

export class UserOrder {
    private sum: number;

    constructor(public action: Action,
                public order: Order) {}

        public countSum(products: Product[]) {
            if (this.sum) { return this.sum; }

            this.sum = this.order.countSum(products);

            return this.sum;
        }
}
