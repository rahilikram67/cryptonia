import { Injectable } from '@angular/core';
import { AdMob, RewardAdOptions, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdService {
  testing = true //!environment.production;
  constructor() { }
  async ngOnInit() {
  }
  async showVideo() {
    const options: RewardAdOptions = {
      adId: environment.rewardId,
      isTesting: this.testing,
      // npa: true
      // ssv: {
      //   userId: "A user ID to send to your SSV"
      //   customData: JSON.stringify({ ...MyCustomData })
      //}
    };
    // await AdMob.prepareRewardVideoAd(options);
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
