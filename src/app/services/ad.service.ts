import { Injectable } from '@angular/core';
import { AdMob, RewardAdOptions, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
@Injectable({
  providedIn: 'root'
})
export class AdService {
  testing = false;
  constructor() { }
  async ngOnInit() { 
  }
  async showVideo() {
    const options: RewardAdOptions = {
      adId: 'ca-app-pub-3220272216269898/6400398379',
      isTesting: this.testing,
      // npa: true
      // ssv: {
      //   userId: "A user ID to send to your SSV"
      //   customData: JSON.stringify({ ...MyCustomData })
      //}
    };
    await AdMob.prepareRewardVideoAd(options);
    const rewardItem = await AdMob.showRewardVideoAd();
  }
  async showInterstitial() {
    const options: RewardAdOptions = {
      adId: 'ca-app-pub-3220272216269898/5414619766',
      isTesting: this.testing,
      // npa: true
      // ssv: {
      //   userId: "A user ID to send to your SSV"
      //   customData: JSON.stringify({ ...MyCustomData })
      //}
    }
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  }
}
