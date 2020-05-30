import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MsgService {
  toasts: any[] = [];

  constructor() { }

  showError(body: string) {
    this.toasts.push({header: 'Uuups!', body, classname: 'bg-danger text-light', delay: 15000});
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
