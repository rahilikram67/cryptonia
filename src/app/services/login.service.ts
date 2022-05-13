import { Injectable } from '@angular/core';
import { SignInResult } from '@capacitor-firebase/authentication';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginData = new BehaviorSubject<SignInResult>(null);
  currentUser: Observable<SignInResult> = this.loginData.asObservable();
  constructor() { }
  next(signResult: SignInResult) {
    this.loginData.next(signResult);
  }
}
