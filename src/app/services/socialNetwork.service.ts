import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { SocialNetwork } from "../models/socialNetwork.interface";
import { environment } from "../../environments/environment"
import { SocialNetworkPayload } from '../models/socialNetworkPayload.interface';

@Injectable({
  providedIn: 'root'
})
export class SocialNetworkService {

  private url: string = environment.api + "social-networks"

  constructor(private http:HttpClient) {  }

  // Listar redes sociales
  list(personId: String): Observable<SocialNetwork[]>{
    return this.http.get<SocialNetwork[]>(this.url + `?personId=${personId}`)
  }

  // Borrar redes social 
  delete(socialNetwork: SocialNetwork): Observable<SocialNetwork>{
    return this.http.delete<SocialNetwork>(this.url + `/${socialNetwork.id}`)
  }

  // Crear redes social
  create(socialNetwork: SocialNetworkPayload): Observable<SocialNetwork>{
    return this.http.post<SocialNetwork>(this.url, socialNetwork)
  }

  // Actualizar redes social
  update(id: String, socialNetwork: SocialNetworkPayload): Observable<SocialNetwork>{
    return this.http.put<SocialNetwork>(this.url + `/${id}`, socialNetwork)
  }
}
