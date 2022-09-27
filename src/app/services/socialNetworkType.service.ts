import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { SocialNetworkType } from "../models/socialNetworkType.interface";
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class SocialNetworkTypeService {

  private url: string = environment.api + "social-network-types"

  constructor(private http:HttpClient) {  }

  // Listar tipos de redes sociales
  list(): Observable<SocialNetworkType[]>{
    return this.http.get<SocialNetworkType[]>(this.url)
  }

  // Borrar tipo de redes social 
  delete(socialNetworkType: SocialNetworkType): Observable<SocialNetworkType>{
    return this.http.delete<SocialNetworkType>(this.url + `/${socialNetworkType.id}`)
  }

  // Crear tipo de redes social
  create(socialNetworkType: SocialNetworkType): Observable<SocialNetworkType>{
    return this.http.post<SocialNetworkType>(this.url, socialNetworkType)
  }

  // Actualizar tipo de redes social
  update(socialNetworkType: SocialNetworkType): Observable<SocialNetworkType>{
    return this.http.put<SocialNetworkType>(this.url + `/${socialNetworkType.id}`, socialNetworkType)
  }
}
