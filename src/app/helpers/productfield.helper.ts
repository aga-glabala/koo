import { Injectable } from '@angular/core';
@Injectable()
export class ProductFieldHelper {

  constructor() { }

  checkText(text: string) {
    // tslint:disable-next-line: max-line-length
    const regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
    if (text.match(regexp)) {
        return '<a href="' + text + '">Link</a>';
    } else {
        return text;
    }
  }
}
