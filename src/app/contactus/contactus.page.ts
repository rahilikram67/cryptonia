import { Component, OnInit } from '@angular/core';
import { AdService } from '../services/ad.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.page.html',
  styleUrls: ['./contactus.page.scss'],
})
export class ContactusPage implements OnInit {

  constructor(
    private adService:AdService
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.adService.showVideo()
    await this.adService.showInterstitial()
  }

}
