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

//TODO borrar
// Import the functions you need from the SDKs you need
/* import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; */
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/* const firebaseConfig = {
  apiKey: "AIzaSyD5NpOW_-LYboOH3SQozgJ0szBz3dTRfLU",
  authDomain: "portfolio-92aa8.firebaseapp.com",
  projectId: "portfolio-92aa8",
  storageBucket: "portfolio-92aa8.appspot.com",
  messagingSenderId: "932927485086",
  appId: "1:932927485086:web:fef8c4b9bd8a4784a6778f",
  measurementId: "G-ZGKKQX8RZL"
}; */

// Initialize Firebase
/* const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); */