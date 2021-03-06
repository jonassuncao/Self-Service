/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AuthExpiredInterceptor } from "./auth-expired-interceptor";
import { AuthInterceptor } from "./auth-interceptor";
import { ExceptionInterceptor } from "./exception-interceptor";
import { NotificationInterceptor } from "./notification-interceptor";

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthExpiredInterceptor, multi: true },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: NotificationInterceptor,
    multi: true,
  },
  { provide: HTTP_INTERCEPTORS, useClass: ExceptionInterceptor, multi: true },
];
