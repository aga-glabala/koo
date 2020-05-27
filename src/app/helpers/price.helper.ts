import { Injectable, Directive, Input } from '@angular/core';

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
import { ValidatorFn, AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
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


export function priceValidator(control: AbstractControl): {[key: string]: any} | null {
    const text = (control.value + '').split(/[.,]/);
    if (text.length > 1 && text[1].length > 2) {
      return {price: {value: control.value}};
    }
    if (+control.value < 0) {
      return {price: {value: control.value}};
    }
    return null;
}

@Directive({
  selector: '[kooPriceValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: PriceValidatorDirective, multi: true}]
})
export class PriceValidatorDirective implements Validator {

  validate(control: AbstractControl): {[key: string]: any} | null {
    return priceValidator(control);
  }
}