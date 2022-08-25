import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import {NbAuthService, NbAuthSimpleToken} from '@nebular/auth';
import {Router} from '@angular/router';
import 'rxjs/add/operator/do';
import {NbToastrService, NbGlobalPhysicalPosition} from '@nebular/theme';
import {Injectable} from '@angular/core';
import {Setting} from './setting';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private authService: NbAuthService, private router: Router, private toastrService: NbToastrService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const baseUrl = '';

    const changeUrl = req.clone({url: baseUrl + req.url});

    if (!req.url.includes('token')) {
      req = changeUrl;
    }

    req = this.addCorsHeader(req);

    if (!req.url.includes('access')) {
      req = this.addAuthenticationToken(req);
      req = this.addJsonHeader(req);
    }

    if (req.url.includes('banner/create') || req.url.includes('standard/create') ||
      req.url.includes('price/create') || req.url.includes('price/update')) {
    } else if (req.url.includes('standard/update')) {
    } else {
      // req = this.addJsonHeader(req);
      // req = this.addJwtHeader(req);
    }

    const config = {
      destroyByClick: true,
      duration: 3000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
      preventDuplicates: true,
    };

    // req = this.addAuthenticationToken(req);

    return next.handle(req).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse && event.status === 201) {
        this.toastrService.warning(
          'Message: 201',
          '201',
          config);
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.toastrService.warning(
            'The application encountered an access level error',
            'Warning: Error 401',
            config);
          setTimeout(() => {
            this.router.navigate(['auth/login']);
          }, 4000);
        } else if (err.status === 500) {
           this.toastrService.warning(
             'Sorry, the application encountered an error ',
             'Error 500', config);
        } else if (err.status === 501) {
          // this.toastrService.warning(
          //   'Sorry, the application encountered an error ',
          //   'Error',
          //   config);
        }
      }
    });
  }

  private addJsonHeader(request: HttpRequest<any>): HttpRequest<any> {

    if (request.headers.has('Content-Type')) {
      return;
    }

    return request.clone({
      headers: request.headers.append('Content-Type', 'application/json'),
    });
  }

  private addCorsHeader(request: HttpRequest<any>): HttpRequest<any> {

    if (request.headers.has('Access-Control-Allow-Origin')) {
      return;
    }

    return request.clone({
      headers: request.headers.append('Access-Control-Allow-Origin', 'http://fc3d-81-242-27-194.ngrok.io'),
    });
  }

  private addJwtHeader(request: HttpRequest<any>): HttpRequest<any> {

    if (request.headers.has('accept')) {
      return;
    }

    return request.clone({
      headers: request.headers.append('accept', 'application/jwt'),
    });
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    if (!this.authService.isAuthenticated()) {
      return request;
    }

    let userToken: string = '';

    this.authService.onTokenChange()
      .subscribe((token: NbAuthSimpleToken) => {
        if (token.isValid()) {
          userToken = token.getValue();
        }
      });

    return request.clone({
      headers: request.headers.append('Authorization', `Bearer ${userToken}`),
    });
  }
}
