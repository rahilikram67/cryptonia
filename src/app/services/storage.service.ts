import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }
  set(key: string, value: any) {
    Preferences.set({ key: key, value: value }).catch(err => console.log(err))
  }
  async get(key: string): Promise<String> {
    const value = await Preferences.get({ key: key })
    return value.value
  }

  async remove(key: string) {
    const value = await Preferences.remove({ key: key })
    return value
  }

  async clear(){
    await Preferences.clear()
  }
}
