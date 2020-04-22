import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DateHelper {

   constructor() {
     moment.locale('pl');
   }

  prettyDate(date: Date) {
    let mdate = moment(date);
    return mdate.fromNow()+ " (" + mdate.format('dddd, DD MMMM h:mm')  + ")";
  }

  prettyShortDate(date: Date) {
    let mdate = moment(date);
    return mdate.fromNow();
  }
  prettyLongDate(date: Date) {
    let mdate = moment(date);
    return mdate.format('dddd, DD MMMM h:mm');
  }
}