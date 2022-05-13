import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { NavController } from "@ionic/angular"
import { StorageService } from '../services/storage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private nav: NavController,
    private capStorage: StorageService
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise<boolean>(async resolve => {
      try {
        let user = await this.capStorage.get("uid")
        if (user) resolve(true)
        else {
          this.nav.navigateForward("/login", { animated: false })
          resolve(false)
        }

      } catch (error) {
        this.nav.navigateForward("/login", { animated: false })
        resolve(false)
      }

    })
  }

}
