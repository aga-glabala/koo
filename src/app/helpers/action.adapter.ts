import { Injectable } from '@angular/core';
import { Action, ProductField } from '../models/action';
import { Product } from '../models/product';
import * as moment from 'moment';
import { Helper, Person } from '../models/person';

@Injectable()
export class ActionFormAdapter {
  /**
   * Converts form object to a Action object
   */

  fromForm(obj, helpers: Helper[], products: Product[], customFields: ProductField[],
           photos: string[]): Action {
    const action = new Action(
        obj.id, obj.name, obj.photoUrl, undefined, undefined,
        this.fromFormToMoment(obj.orderDate, obj.orderTime),
        this.fromFormToMoment(obj.payDate, obj.payDate),
        obj.payLock,
        this.fromFormToMoment(obj.collectionDate, obj.collectionTime),
        obj.rules, obj.description, obj.collection, obj.payment, obj.productsEditable, helpers, products, photos, customFields, obj.cost, obj.discount
    );
    return action;
  }

  /**
   * Converts a Action object to a form object
   */
  toForm(action: Action): {} {
    const order = this.toFormFromMoment(action.orderDate);
    const pay = this.toFormFromMoment(action.payDate);
    const collection = this.toFormFromMoment(action.collectionDate);

    const formdata: {} = {
        id: action.id,
        name: action.name,
        photoUrl: action.photoUrl,
        orderDate: order.date,
        orderTime: order.time,
        payDate: pay.date,
        payTime: pay.time,
        payLock: action.payLock,
        collectionDate: collection.date,
        collectionTime: collection.time,
        description: action.description,
        rules: action.rules,
        collection: action.collection,
        payment: action.payment,
        productsEditable: action.productsEditable
    };
    return { newaction: formdata };
  }

  fromFormToMoment(date: {year: number, month: number, day: number}, time: {hour: number, minute: number}): moment.Moment {
    return moment({ year: date.year, month: date.month - 1,
      day: date.day, hour: time.hour, minute : time.minute})
  }

  toFormFromMoment(date: moment.Moment) {
    return {date: {day: date.date(), month: date.month() + 1, year: date.year()},
            time: {hour: date.hour(), minute: date.minute()}};
  }
}
