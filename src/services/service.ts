import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class Service {
    public apiUrl = 'https://localhost:7146/api/';
    constructor(private http: HttpClient) {
    }
    public GetDateTime(inputdate: any){
        const date = new Date(inputdate);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const minutes = date.getMinutes();
        const hours = date.getHours();
        const seconds = date.getSeconds();
        return year+"-"+(monthIndex+1)+"-"+day +" "+ hours+":"+minutes+":"+seconds;
    }
    // get data by http post
    public GetDataByPost(model: any, action: string) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const api = this.apiUrl + action;
        return this.http
            .post<any>(api, model, { headers })
            .pipe(catchError(err => this.handleError(err)));
    }

    // Get Data
    public GetData(action: string) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const api = this.apiUrl + action;
        return this.http
            .get<object[]>(api, { headers })
            .pipe(
                map((data) => data),
                catchError((err)=> this.handleError(err))
            );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.log('An error occurred:', error.error.message);
        } else {
            console.log(`Backend returned code ${error.status}, ` + `body was: ${error.name}`);
        }
        return throwError(error);
    }
}
