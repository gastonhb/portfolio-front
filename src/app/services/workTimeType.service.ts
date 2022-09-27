
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { WorkTimeType } from "../models/workTimeType.interface";
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})

export class WorkTimeTypeService {

  private url: string = environment.api + "work-time-types"
  
  constructor(private http:HttpClient) {  }

  list():Observable<WorkTimeType[]>{
    return this.http.get<WorkTimeType[]>(this.url)
  }

  delete(workTimeType: WorkTimeType): Observable<WorkTimeType>{
    return this.http.delete<WorkTimeType>(this.url + `/${workTimeType.id}`)
  }

  create(workTimeType:WorkTimeType): Observable<WorkTimeType>{
    return this.http.post<WorkTimeType>(this.url, workTimeType)
  }

  update(workTimeType:WorkTimeType): Observable<WorkTimeType>{
    return this.http.put<WorkTimeType>(this.url + `/${workTimeType.id}`, workTimeType)
  }

  get(workTimeTypeId: string):Observable<WorkTimeType>{
    return this.http.get<WorkTimeType>(this.url + `/${workTimeTypeId}`)
  }
}
