import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import allIcons from './data.json';
import compare from './compare.json';
import { NavController } from '@ionic/angular';
import { AdService } from '../services/ad.service';
@Component({
  selector: 'app-market',
  templateUrl: './market.page.html',
  styleUrls: ['./market.page.scss'],
})
export class MarketPage implements OnInit {
  data: any = [];
  allData: any = [];
  filteredData = [];
  skeleton = Array(6).fill(0);
  showSkelton = false
  icons = allIcons;
  compare = compare;
  filter = 'USDT';
  showSearch = false;
  nodata = false
  constructor(
    private router: NavController,
    private adService: AdService
  ) { }
  async ngOnInit() {
    this.showSkelton = true
    try {
      this.allData = (
        await axios.get('https://api.binance.com/api/v3/ticker/24hr')
      ).data;
      this.filteredData = this.parseData(this.allData, this.filter);
      this.data = this.filteredData;
    } catch (error) {
      this.nodata = true
    }
    this.showSkelton = false
    // show ads
  }

  async ionViewWillEnter() {
    await this.adService.showVideo()
    await this.adService.showInterstitial()
  }


  parseData(data: any, using = 'USDT') {
    this.showSkelton = true
    let arr = [];
    let temp = data.filter((item: any) => item.symbol.endsWith(using));

    for (let el of temp) {
      let symbol: any = el.symbol.replace(using, '');
      let price = Number(el.lastPrice);
      arr.push({
        symbol: symbol,
        price: price,
        percent: el.priceChangePercent.slice(0, 4),
        using,
        volume: Number(el.volume).toFixed(0),
        color:
          el.prevClosePrice > el.lastPrice ? 'text-red-600' : 'text-green-600',
      });
      arr.sort((a, b) => Number(b.price) - Number(a.price));
    }
    this.showSkelton = false
    return arr;
  }
  includes(symbol) {
    return this.icons.indexOf(symbol) > -1;
  }
  filterChange(ev: any) {
    this.filter = ev.value;
    this.data = this.parseData(this.allData, this.filter);
  }
  search() {
    this.showSearch = !this.showSearch;
  }
  find(el) {
    this.showSkelton = true
    if (!el.value) this.data = this.filteredData;
    else
      this.data = this.filteredData.filter((item: any) =>
        item.symbol.includes(el.value.toUpperCase())
      );
    this.showSkelton = false
  }
  details(obj) {
    this.router.navigateForward([
      '/details',
      {
        baseAsset: `${obj.symbol}`,
        quoteAsset: this.filter,
        price: obj.price,
        percent: obj.percent,
        volume: obj.volume,
        color: obj.color,
      },
    ]);
  }

  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      window.location.reload()
      event.target.complete();
    }, 2000);
  }
}
