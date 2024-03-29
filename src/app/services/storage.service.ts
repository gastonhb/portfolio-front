import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'
import { environment } from 'src/environments/environment';

firebase.initializeApp(environment.firebaseConfig)

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storageRef = firebase.app().storage().ref();

  constructor() { }

  // Subir una imagen
  async uploadImage(nombre: string, imgBase64: any){
    try {
      let response = await this.storageRef.child(nombre).putString(imgBase64,'data_url')
      return await response.ref.getDownloadURL();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // Borrar una imagen
  async deleteImage (url: string){
    try { 
      let pictureRef = firebase.app().storage().refFromURL(url);
      pictureRef.delete()
    } catch (err) {
      console.log(err);
    }
  
 }
}