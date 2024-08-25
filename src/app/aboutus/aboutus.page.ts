import { Component, OnInit } from '@angular/core';
import { AdService } from '../services/ad.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.page.html',
  styleUrls: ['./aboutus.page.scss'],
})
export class AboutusPage implements OnInit {

  constructor(
    private adService:AdService
  ) { }

  ngOnInit() {
  }

}
