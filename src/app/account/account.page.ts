import { Component, ViewChild, ElementRef } from '@angular/core';
import jsQR from "jsqr"
import { FirestoreService } from '../services/firestore.service';
import { StorageService } from '../services/storage.service';
declare const WAValidator: any;
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage {
  registered = false
  supported = ["BCH", "BTG", "DASH", "DCR", "DGB", "DOGE", "ETH", "ETC", "KMD", "LTC", "XMR", "NANO", "NEO", "GAS", "QTUM", "XRP", "ZEC", "ZEN", "BTC"]
  @ViewChild("video", { static: false }) video: ElementRef;
  @ViewChild("canvas", { static: false }) canvas: ElementRef;
  videoEl: HTMLVideoElement;
  canvasEl: HTMLCanvasElement;
  context: CanvasRenderingContext2D
  input = ""
  validMsg = ""
  activeScan = false
  stream: MediaStream
  wallet = { coin: "", address: "" }
  constructor(
    private fireService: FirestoreService,
    private capStorage: StorageService
  ) { }
  async ngOnInit() {
    let obj = await this.fireService.getDocById("wallets", await this.capStorage.get("uid") as string)
    if (!obj) return
    this.wallet = obj
  }
  async ngAfterViewInit() {
    this.videoEl = this.video.nativeElement;
    this.canvasEl = this.canvas.nativeElement;
    this.context = this.canvasEl.getContext("2d");
  }

  async checkWallet() {
    if (!this.input) return this.validMsg = "Please enter a wallet address"

    for (let v of this.supported) {
      let valid = WAValidator.validate(this.input, v)
      if (valid) {
        this.wallet.coin = v
        this.wallet.address = this.input
        break
      }
    }
    if (this.wallet.coin == "") return this.validMsg = "Invalid wallet address"
    this.validMsg = ""
    await this.fireService.setDocById("wallets", await this.capStorage.get("uid") as string, this.wallet)
    this.registered = true
  }
  async startScan() {
    this.activeScan = !this.activeScan
    if (!this.activeScan) return this.stream.getTracks().forEach(track => track.stop())
    else {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      this.videoEl.srcObject = this.stream;
      this.videoEl.setAttribute("playsinline", 'true');
      this.videoEl.play()
      this.videoEl.onchange = () => alert("changed")
      requestAnimationFrame(this.scan.bind(this))
    }
  }
  async scan() {
    if (this.videoEl.readyState === this.videoEl.HAVE_ENOUGH_DATA) {
      this.context.drawImage(this.videoEl, 0, 0, this.canvasEl.width, this.canvasEl.height);
      const imageData = this.context.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code?.data) {
        this.input = code.data
        this.activeScan = false
        this.stream.getTracks().forEach(track => track.stop())
      }
      else requestAnimationFrame(this.scan.bind(this))
    }
    else requestAnimationFrame(this.scan.bind(this))
  }
  toggleRegister() {
    this.registered = !this.registered
  }

}
