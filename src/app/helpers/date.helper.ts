import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DateHelper {

   constructor() {
     moment.locale('pl');
   }

  prettyDate(date: moment.Moment) {
    return date.fromNow()+ " (" + date.format('dddd, DD MMMM h:mm')  + ")";
  }

  prettyShortDate(date: moment.Moment) {
    return date.fromNow();
  }
  prettyLongDate(date: moment.Moment) {
    return date.format('dddd, DD MMMM h:mm');
  }
}