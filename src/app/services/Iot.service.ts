import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Iotstate } from '../interfaces/iotstate';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AppConfiguration } from 'read-appsettings-json';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { HttpuserdataService } from './httpuserdata.service';
@Injectable({
  providedIn: 'root',
})
export class IotService {
  constructor(
    private http: HttpClient,
    private httpUserdataService: HttpuserdataService
  ) {}
  public iotstate = new BehaviorSubject<Iotstate[] | null>(null);
  private url: string = AppConfiguration.Setting().url;
  private hubConnection!: signalR.HubConnection;
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url + 'iothub/')
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  };

  public addTransferChartDataListener() {
    this.hubConnection.on('ReceiveMessage', (way: string, data: Iotstate) => {
      this.getiot().subscribe();
    });
  }

  public getiot() {
    return this.http.get<Iotstate[]>(this.url + 'IOT').pipe(
      catchError(this.handleError.bind(this)),
      tap((resData) => {
        this.httpUserdataService.isConnecting.next(true);
        this.iotstate.next(resData);
      })
    );
  }

  public addIot(data: Iotstate) {
    const _data = new FormData();
    _data.append('name', data.name);
    _data.append('type', data.type);
    _data.append('deadline', String(data.deadline));
    return this.http.post<String>(this.url + 'IOT', data).pipe(
      catchError(this.handleError.bind(this)),
      tap(() => {
        // this.getiot().subscribe();
        this.httpUserdataService.isConnecting.next(true);
      })
    );
  }

  public deliot(iotid: number) {
    return this.http.delete<Iotstate[]>(this.url + 'IOT/?IOTID=' + iotid).pipe(
      catchError(this.handleError.bind(this)),
      tap(() => {
        this.httpUserdataService.isConnecting.next(true);
        this.getiot().subscribe();
      })
    );
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);

    let errorMessage = '發生未知的錯誤';
    if (!errorRes.error) {
      return throwError(() => errorMessage);
    }
    if (errorRes.status === 0) {
      errorMessage = '與伺服器連接失敗';
      this.httpUserdataService.isConnecting.next(false);
      return throwError(() => errorMessage);
    }
    this.httpUserdataService.isConnecting.next(true);
    return throwError(() => errorMessage);
  }
}
