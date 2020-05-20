import * as uuid from 'uuid';

export class Product {
    constructor(
                public id: string,
                public name: string,
                public variant: string,
                public price: number,
                public customFields: {}) {
                    if (!id) {
                        this.id = uuid.v4();
                    }
                }
}
