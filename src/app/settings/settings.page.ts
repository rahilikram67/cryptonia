import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  btns = ["Logout", "Delete Account"]
  darkToggle = false;
  constructor(
    private capStorage: StorageService,
    private nav: NavController,

  ) { }

  async ngOnInit() {
    this.darkToggle = (await this.capStorage.get('darkMode')) == "true"
  }
  darkMode(ev: any) {
    document.body.classList.toggle('dark', ev.detail.checked);
    this.capStorage.set('darkMode', String(ev.detail.checked))
  }

  
}
