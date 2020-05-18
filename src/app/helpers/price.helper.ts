import { Injectable } from '@angular/core';

@Injectable()
export class PriceHelper {

   constructor() {
   }

  convertPriceToNumber(price: number) {
    const priceArr = price.toString().split(/[.,]/);
    if (priceArr.length > 1) {
      priceArr[1] = priceArr[1].slice(0, 2);

      if (priceArr[1].length === 1) {
        priceArr[1] += '0';
      } else if (priceArr[1].length === 0) {
        priceArr[1] = '00';
      }
    } else {
      priceArr.push('00');
    }
    return +priceArr.join('');
  }

  convertPriceToFloat(price: number) {
    return _convert(price);
  }
}

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'price'})
export class PricePipe implements PipeTransform {
  transform(price: number): number {
    return _convert(price);
  }
}

function _convert(price: number) {
  const p = '00' + price;
  return +(p.slice(0, -2) + '.' + p.substr(-2));
}
