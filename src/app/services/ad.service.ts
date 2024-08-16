import { Injectable } from '@angular/core';
import { AdMob, RewardAdOptions, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdService {
  testing = false //!environment.production;
  constructor() { }
  async ngOnInit() {
  }
  async showVideo() {
    // const options: RewardAdOptions = {
    //   adId: environment.rewardId,
    //   isTesting: this.testing,
    //   npa: true,
    // };
    // await AdMob.prepareRewardVideoAd(options)    
    // const rewardItem = await AdMob.showRewardVideoAd();
  }
  async showInterstitial() {
    // await AdMob.prepareInterstitial({
    //   adId: environment.intertial,
    //   isTesting: this.testing,
    // });
    // await AdMob.showInterstitial();
  }
}
