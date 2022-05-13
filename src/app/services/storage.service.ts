import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }
  set(key: string, value: any) {
    Storage.set({ key: key, value: value }).catch(err => console.log(err))
  }
  async get(key: string): Promise<String> {
    const value = await Storage.get({ key: key })
    return value.value
  }

  async remove(key: string) {
    const value = await Storage.remove({ key: key })
    return value
  }

  async clear(){
    await Storage.clear()
  }
}
