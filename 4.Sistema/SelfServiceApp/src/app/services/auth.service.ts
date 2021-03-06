import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { LoadingController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { delay, finalize, map, switchMap, take } from "rxjs/operators";
import { LoginCommand } from "../models/commands/login.command";
import { ApiService } from "./api.service";
import { TokenStorageService } from "./token-storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token: string;
  private helper = new JwtHelperService();

  constructor(
    private api: ApiService,
    private translateService: TranslateService,
    private loadingController: LoadingController,
    private tokenStorageService: TokenStorageService
  ) {
    this.loadInitToken();
  }

  public authenticate(command: LoginCommand): Observable<string> {
    return this.api
      .post("/authentication", command)
      .pipe(map(this.extractAndLoadToken));
  }

  public getToken() {
    return this.token;
  }

  public hasToken(): boolean {
    return !!this.token;
  }

  public getTokenValue(): { sub: string; auth: string[]; tnt: string } {
    return this.helper.decodeToken(this.token);
  }

  public clear() {
    this.token = null;
    this.tokenStorageService.clear();
  }

  private extractAndLoadToken = (res: any): string => {
    const token = res.token;
    this.tokenStorageService.save(token);
    this.loadToken(token);
    return token;
  };

  private loadToken = (token: string) => {
    this.token = token;
  };

  private loadInitToken() {
    this.translateService
      .get("global.wait")
      .subscribe((message) =>
        this.loadingController.create({ message }).then(this.loadStorage)
      );
  }

  private loadStorage = (loading: HTMLIonLoadingElement) => {
    loading.present();
    this.tokenStorageService
      .getValue()
      .pipe(
        switchMap((v) => (v ? of(v).pipe(delay(2000)) : of(v))),
        take(1),
        finalize(() => loading.dismiss())
      )
      .subscribe(this.loadToken);
  };
}
