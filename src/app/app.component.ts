import { Component, OnInit } from '@angular/core';
import { AdService } from './services/ad.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Market', url: '/market', img: "assets/icon/BTC.png" },
    { title: 'Settings', url: '/settings', img: "assets/settings.gif" },
    { title: 'About us', url: '/aboutus', img: "assets/person.png" },
    { title: 'Contact us', url: '/contactus', img: "assets/mail.png" },
  ];
  userData = { img: "", name: "", email: "" }
  constructor(
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
    
    
    //show ad
    setInterval(async() => {
      await this.adService.showVideo()
    }, 10*60*1000)
  }
  async ngAfterViewInit() {
    // enable dark mode is user applied for this
    
  }
}
