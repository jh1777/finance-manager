import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map, retry } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private service: string = "gehalt";
  private url = `${environment.apiUrl}/${this.service}`;
  
  constructor(private httpClient: HttpClient) { }

  private httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });
     
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

  getEntry<T extends HasId>(id: number): Observable<T[]> {
    return this.httpClient.get<T[]>(
      this.url, { observe: 'response' })
      .pipe(
        map(entries => entries.body.filter(entry => entry.id === id)),
        retry(1),
        catchError(this.errorHandler)
      );
  }

  deleteEntry<T>(id: number): Observable<HttpResponse<T>> {
    var removeUrl = this.url + `/${id}`;
    var result = this.httpClient.delete<T>(removeUrl, { headers: this.httpOptions, observe: 'response' })
      .pipe(
        catchError(this.errorHandler)
      );

    //this.messageService.logMessage(`DELETE ${this.service} Call URL: ${removeUrl}`, true);

    return result;
  }

  createEntry<T>(model: T): Observable<HttpResponse<T>> {
    var result = this.httpClient.post<T>(this.url, model, { headers: this.httpOptions, observe: 'response' })
      .pipe(
        catchError(this.errorHandler)
      );

    //this.messageService.logMessage('POST Call URL: ' + this.url, true);
    
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