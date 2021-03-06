import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map, retry } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private service: string = "salaries";
  private url = `${environment.apiUrl}/${this.service}`;
  
  constructor(private httpClient: HttpClient) { }

  private httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });
     
  setService(service: string) {
    this.service = service;
    this.url = `${environment.apiUrl}/${service}`;
  }

  getAllEntries<T>(): Observable<HttpResponse<T[]>> {
    return this.httpClient.get<T[]>(
      this.url, { observe: 'response' })
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  // Get without HttpClientResponse
  getEntries<T>(): Observable<T[]> {
    return this.httpClient.get<T[]>(
      this.url)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getEntry<T>(id: string): Observable<HttpResponse<T>> {
    var url = `${this.url}/${id}`;
    var result = this.httpClient.get<T>(url, { headers: this.httpOptions, observe: 'response' })
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );

    return result;
  }

  deleteEntryById<T>(id: string): Observable<HttpResponse<T>> {
    var removeUrl = `${this.url}/${id}`;
    var result = this.httpClient.delete<T>(removeUrl, { headers: this.httpOptions, observe: 'response' })
      .pipe(
        catchError(this.errorHandler)
      );

    return result;
  }

  createEntry<T>(model: Array<T>): Observable<HttpResponse<Array<T>>> {
    var result = this.httpClient.post<Array<T>>(this.url, model, { headers: this.httpOptions, observe: 'response' })
      .pipe(
        catchError(this.errorHandler)
      );
    return result;
  }

  changeEntry<T>(id: string, model: T): Observable<HttpResponse<T>> {
    var url = `${this.url}/${id}`;
    var result = this.httpClient.put<T>(url, model, { headers: this.httpOptions, observe: 'response' })
      .pipe(
        catchError(this.errorHandler)
      );
    return result;
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //this.messageService.logError(errorMessage, true);
    return throwError(errorMessage);
  }

}

interface HasId {
  id: number;
}