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

  fromForm(obj, helpers: Helper[], products: Product[], customFields: ProductField[], createdBy: Person, createdOn: moment.Moment): Action {
    let action = new Action(
        obj.id, obj.name, obj.photoUrl, createdBy, createdOn, 
        moment({ year: obj.orderDate.year, month: obj.orderDate.month-1, day: obj.orderDate.day, hour: obj.orderTime.hour, minute :obj.orderTime.minute}),
        moment({ year: obj.payDate.year, month: obj.payDate.month-1, day: obj.payDate.day, hour: obj.payTime.hour, minute :obj.payTime.minute}),
        obj.payLock,
        moment({ year: obj.collectionDate.year, month: obj.collectionDate.month-1, day: obj.collectionDate.day, hour: obj.collectionTime.hour, minute :obj.collectionTime.minute}),
        obj.rules, obj.description, obj.collection, obj.payment, obj.productsEditable, helpers, products, customFields
    );
    return action;
  }

  /**
   * Converts a Action object to a form object
   */
  toForm(action: Action): {} {
    let formdata : {} = {
        id: action.id,
        name: action.name,
        photoUrl: action.photoUrl,
        orderDate: {'day': action.orderDate.date(), 'month': action.orderDate.month() + 1, 'year': action.orderDate.year()},
        orderTime: {'hour': action.orderDate.hour(), 'minute': action.orderDate.minute()},
        payDate: {'day': action.payDate.date(), 'month': action.payDate.month() + 1, 'year': action.payDate.year()},
        payTime: {'hour': action.payDate.hour(), 'minute': action.payDate.minute()},
        payLock: action.payLock,
        collectionDate: {'day': action.collectionDate.date(), 'month': action.collectionDate.month() + 1, 'year': action.collectionDate.year()},
        collectionTime: {'hour': action.collectionDate.hour(), 'minute': action.collectionDate.minute()},
        description: action.description,
        rules: action.rules,
        collection: action.collection,
        payment: action.payment,
        productsEditable: action.productsEditable
    };
    return { newaction: formdata };
  }

}