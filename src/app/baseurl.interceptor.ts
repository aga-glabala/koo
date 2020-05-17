import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

  constructor(
    @Inject('BASE_API_URL') private baseUrl: string) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.startsWith('/api') || !this.baseUrl) {
      return next.handle(request);
    }
    const path = request.url.substring(4);
    const apiReq = request.clone({ url: `${this.baseUrl}${path}` });
    return next.handle(apiReq);
  }
}