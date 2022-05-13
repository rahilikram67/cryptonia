import { Component, OnInit } from '@angular/core';
import { AdService } from './services/ad.service';
import { FirestoreService } from './services/firestore.service';
import { LoginService } from './services/login.service';
import { StorageService } from './services/storage.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Market', url: '/market', img: "assets/icon/BTC.png" },
    { title: 'Settings', url: '/settings', img: "assets/settings.gif" },
    { title: 'Account', url: '/account', img: "assets/person.png" }
  ];
  userData = { img: "", name: "", email: "" }
  constructor(
    private fireService: FirestoreService,
    private capStorage: StorageService,
    private loginService: LoginService,
    private adService: AdService
  ) {
    // If user is not first logged this will help to login him again
    // this.loginService.currentUser.subscribe(data => {
    //   if (!data) return
    //   let { user } = data
    //   this.userData = { img: user?.photoUrl, name: user?.displayName, email: user?.email }
    // })
  }
  async ngOnInit() {
    // check if user if registered, if he is initalize his data
    let uid = await this.capStorage.get("uid")
    if (!uid) return
    let data = await this.fireService.getDocById("users", String(uid))
    this.userData = { img: "assets/outer-logo.png", name: data?.displayName, email: data?.email }
    //show ad
    // setInterval(async() => {
    //   await this.adService.showVideo()
    // }, 10*60*1000)
  }
  async ngAfterViewInit() {
    // enable dark mode is user applied for this
    let dark = (await this.capStorage.get('darkMode')) == "true"
    document.body.classList.toggle('dark', dark);
  }
}
