import { Component } from '@angular/core';
import { FirebaseAuthentication, SignInResult } from "@capacitor-firebase/authentication"
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment.prod';
import { StorageService } from '../services/storage.service';
import { FirestoreService } from '../services/firestore.service';
import { NavController } from '@ionic/angular';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  btns = [
    {
      title: "Sign in with Google",
      icon: "logo-google",
      color: "danger"
    },
    // {
    //   title: "Sign in with Facebook",
    //   icon: "logo-facebook",
    //   color: "tertiary"
    // },
    {
      title: "Sign in with Twitter",
      icon: "logo-twitter",
      color: "secondary"
    },
  ]
  progress = true
  constructor(
    private fireService: FirestoreService,
    private capStorage: StorageService,
    private nav: NavController,
    private loginService: LoginService
  ) {
    initializeApp(environment.firebase)
  }
  ngOnInit() { }
  async signIn(logo: string) {
    let user: SignInResult = null
    this.toggle()
    if (logo == "logo-google") user = await FirebaseAuthentication.signInWithGoogle()
    else if (logo == "logo-facebook") user = await FirebaseAuthentication.signInWithFacebook()
    else user = await FirebaseAuthentication.signInWithTwitter()
    await this.fireService.setDocById("users", user.user.uid, user.user)
    this.capStorage.set("uid", user.user.uid)
    this.loginService.next(user)
    this.toggle()
    this.nav.navigateForward("/market")
  }
  toggle(){
    this.progress = !this.progress
  }
}
