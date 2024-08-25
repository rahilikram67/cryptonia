import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import ApexCharts from "apexcharts"
import { AdService } from '../services/ad.service';
import { ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../services/storage.service';
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
  isDarkMode = false
  constructor(
    private route: ActivatedRoute,
    private adService: AdService,
    private toast: ToastController,
    private http: HttpClient,
    private capStorage: StorageService,
  ) {
    this.params = this.route.snapshot.params
    this.capStorage.get("darkMode").then(res => this.isDarkMode = res == "true")
  }

  async ngOnInit() {
    try {
      this.monthly = (await lastValueFrom(this.http.get<any>("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1M")))?.slice(-12)
    } catch (error) {
      const toast = await this.toast.create({ message: 'Couldn\'t fetch details', duration: 2000, position: "bottom" })
      await toast.present()
      return
    }

    this.chart1()
    this.chart2()
    this.chart3()
  }

  async ionViewWillEnter() {
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

    try {
      this.data = (await lastValueFrom(this.http.get<any>(`${uri}?${params}`)))
    } catch (error) {
      const toast = await this.toast.create({ message: 'Couldn\'t fetch details', duration: 2000, position: "bottom" })
      await toast.present()
      return
    }



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
        toolbar: {
          tools: {
              download: false  // This will remove the download option
          }
      }
      },
      series: [{
        data: this.chart1_series()
      }],
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: this.isDarkMode ? '#f0f0f0' : '#000000'  // Dark mode x-axis labels
          }
        },
        axisBorder: {
          color: this.isDarkMode ? '#444444' : '#e0e0e0'  // Dark mode x-axis border
        },
        axisTicks: {
          color: this.isDarkMode ? '#444444' : '#e0e0e0'  // Dark mode x-axis ticks
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: this.isDarkMode ? '#f0f0f0' : '#000000'  // Dark mode x-axis labels
          }
        },
        axisBorder: {
          color: this.isDarkMode ? '#444444' : '#e0e0e0'  // Dark mode x-axis border
        },
        axisTicks: {
          color: this.isDarkMode ? '#444444' : '#e0e0e0'  // Dark mode x-axis ticks
        }
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#3C90EB',
            downward: '#DF7D46'
          }
        }
      },
      tooltip: {
        theme: this.isDarkMode ? 'dark' : 'light',
      }
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
        height: 350,
        toolbar: {
          tools: {
              download: false  // This will remove the download option
          }
      }
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
        categories: this.monthly.map(d => new Date(d[0]).toString().substring(4, 7)),
        labels: {
          style: {
            colors: this.isDarkMode ? '#f0f0f0' : '#000000'  // Dark mode x-axis labels
          }
        },
        axisBorder: {
          color: this.isDarkMode ? '#444444' : '#e0e0e0'  // Dark mode x-axis border
        },
        axisTicks: {
          color: this.isDarkMode ? '#444444' : '#e0e0e0'  // Dark mode x-axis ticks
        }
      },
      yaxis: {
        title: {
          text: `${this.params.quoteAsset}`
        },
        labels: {
          style: {
            colors: this.isDarkMode ? '#f0f0f0' : '#000000'  // Dark mode x-axis labels
          }
        },
        axisBorder: {
          color: this.isDarkMode ? '#444444' : '#e0e0e0'  // Dark mode x-axis border
        },
        axisTicks: {
          color: this.isDarkMode ? '#444444' : '#e0e0e0'  // Dark mode x-axis ticks
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        theme: this.isDarkMode ? 'dark' : 'light',
        y: {
          formatter: function (val) {
            return val + ` ${barTitle}`
          }
        },
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
        },
        toolbar: {
          tools: {
              download: false  // This will remove the download option
          }
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
        categories: this.monthly.map(d => new Date(d[0]).toString().substring(4, 7)),
        labels: {
          style: {
            colors: this.isDarkMode ? '#f0f0f0' : '#000000'  // Dark mode x-axis labels
          }
        },
        axisBorder: {
          color: this.isDarkMode ? '#444444' : '#e0e0e0'  // Dark mode x-axis border
        },
        axisTicks: {
          color: this.isDarkMode ? '#444444' : '#e0e0e0'  // Dark mode x-axis ticks
        }
      },
      yaxis: {
        title: {
          text: `${this.params.quoteAsset}`
        },
        labels: {
          style: {
            colors: this.isDarkMode ? '#f0f0f0' : '#000000'  // Dark mode x-axis labels
          }
        },
        axisBorder: {
          color: this.isDarkMode ? '#444444' : '#e0e0e0'  // Dark mode x-axis border
        },
        axisTicks: {
          color: this.isDarkMode ? '#444444' : '#e0e0e0'  // Dark mode x-axis ticks
        }
      },
      tooltip: {
        theme: this.isDarkMode ? 'dark' : 'light',
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
