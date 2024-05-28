import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from "axios"
import ApexCharts from "apexcharts"
import { AdService } from '../services/ad.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  chart: ApexCharts[] = []
  data: any = []
  params: any = {}
  monthly: any[] = []
  segments = ['5m', "15m", "30m", "1h"]
  interval = "5m"
  dates = { first: "", last: "" }
  labels = [
    {
      text: "Price",
      prop: "price"
    },
    {
      text: "Volume",
      prop: "volume"
    },
    {
      text: "Asset",
      prop: "baseAsset"
    },
    {
      text: "Swap",
      prop: "quoteAsset"
    },
    {
      text: " % Change",
      prop: "percent"
    }
  ]
  charts_arr = [
    {
      id: "chart1",
      title: "Stock Market"
    },
    {
      id: "chart2",
      title: "Volume"
    }
  ]
  constructor(
    private route: ActivatedRoute,
    private adService: AdService
  ) {
    this.params = this.route.snapshot.params
  }

  async ngOnInit() {
    this.adService.showInterstitial()
    this.monthly = (await axios.get("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1M")).data.slice(-12)
    this.chart1()
    this.chart2()
    this.chart3()
  }

  async ionViewWillEnter() {
    await this.adService.showVideo()
    await this.adService.showInterstitial()
  }

  async getData(start: number = null, end: number = null) {
    let uri = "https://api.binance.com/api/v3/klines"
    let opts = {
      symbol: `${this.params.baseAsset}${this.params.quoteAsset}`,
      interval: this.interval,
    }
    start && Object.assign(opts, { startTime: start })
    end && Object.assign(opts, { endTime: end })
    let params = new URLSearchParams(opts as any).toString()
    this.data = (await axios.get(`${uri}?${params}`)).data
    this.dates.first = new Date(this.data[0][0]).toISOString().replace("T", " ")
    this.dates.last = new Date(this.data.slice(-1)[0][0]).toISOString().replace("T", " ")
    this.data = this.data.length > 45 ? this.data.slice(-45) : this.data
  }

  chart1_series() {
    return this.data.map(d => {
      let time = new Date(d[0])
      return {
        x: time,
        y: d.slice(1, 5)
      }
    })
  }

  async chart1() {
    await this.getData()

    this.chart[0] = new ApexCharts(document.querySelector("#chart1"), {
      chart: {
        type: "candlestick",
        height: "45%",
        width: "100%",
      },
      series: [{
        data: this.chart1_series()
      }],
      xaxis: {
        type: 'datetime'
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#3C90EB',
            downward: '#DF7D46'
          }
        }
      },
    })
    this.chart[0].render();
  }
  async chart2() {
    let barTitle = this.params.quoteAsset
    var options = {
      series: [{
        name: 'Volume',
        data: this.monthly.map(d => Number(d[5]).toFixed(2))
      }],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: this.monthly.map(d => new Date(d[0]).toString().substring(4, 7))
      },
      yaxis: {
        title: {
          text: `${this.params.quoteAsset}`
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ` ${barTitle}`
          }
        }
      }
    };

    this.chart[1] = new ApexCharts(document.querySelector("#chart2"), options);
    this.chart[1].render();
  }
  async chart3() {
    var options = {
      series: [{
        name: this.params.quoteAsset,
        data: this.monthly.map(d => Number(d[5]).toFixed(2))
      }],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: this.monthly.map(d => new Date(d[0]).toString().substring(4, 7))
      },
      yaxis: {
        title: {
          text: `${this.params.quoteAsset}`
        }
      }
    };

    this.chart[2] = new ApexCharts(document.querySelector("#chart3"), options);
    this.chart[2].render();
  }
  async segmentChange(target) {
    this.interval = target.value
    await this.getData()
    this.chart[0].updateSeries([{ data: this.chart1_series() }])
  }
  async timeChange(target, turn) {
    this.dates[turn] = target.value
    await this.getData(new Date(this.dates.first.replace(" ", "T")).getTime(), new Date(this.dates.last.replace(" ", "T")).getTime())
    this.chart[0].updateSeries([{ data: this.chart1_series() }])
  }

}
