import { Injectable } from '@angular/core';
import { deleteDoc, doc, docData, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  async setDocById(collection: string, id: string, data: any) {
    await setDoc(doc(this.firestore, collection, id), data, { merge: true })
  }
  async getDocById(collection: string, id: string): Promise<any> {
    return new Promise(resolve => {
      docData(doc(this.firestore, collection, id)).subscribe(resolve)
    })
  }
  delDoc(collection: string, id: string) {
    deleteDoc(doc(this.firestore, collection, id))
  }
}
