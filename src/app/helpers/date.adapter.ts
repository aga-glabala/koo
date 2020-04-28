import { Injectable } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { firestore } from 'firebase';

@Injectable()
export class NgbDateFirestoreAdapter {
  /**
   * Converts Firestore TimeStamp to a Date object
   */

  fromModel(ts: firestore.Timestamp): Date {
    if (ts instanceof firestore.Timestamp) {
      return ts.toDate();
    } else return null;
  }

  /**
   * Converts a NgbDateStruct to a Firestore TimeStamp
   */
  toModel(ngbDate: NgbDateStruct, ngbTime: NgbTimeStruct): Date {
    const jsDate = new Date(
      ngbDate.year ? ngbDate.year : new Date().getFullYear(),
      ngbDate.month ? ngbDate.month - 1 : new Date().getMonth() - 1,
      ngbDate.day ? ngbDate.day : new Date().getDate(),
      ngbTime.hour,
      ngbTime.minute
    );
    return jsDate;
  }

}