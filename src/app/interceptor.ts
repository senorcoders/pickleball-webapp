import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class interceptor implements HttpInterceptor {

    public static url = "http://localhost:8781"; // 'https://pickleweb.senorcoders.com';

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (AuthService.getToken() !== "") {
            req = req.clone({
                url: interceptor.url + req.url,
                setHeaders: {
                    'token': AuthService.getToken()
                }
            });
        } else {
            req = req.clone({
                url: interceptor.url + req.url
            });
        }

        return next.handle(req);

    }

    public static tranformUrl(url: string) {
        if (AuthService.getToken() !== "") {
            return interceptor.url + url + "?token=" + AuthService.getToken();
        } else {
            return interceptor.url + url;
        }
    }
}