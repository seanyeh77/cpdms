import { UserlogTable } from './../interfaces/user-data';
import { Iotstate } from './../interfaces/iotstate';
import { Userlog } from './../interfaces/userlog';
import { UserData } from './../interfaces/userdata';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, tap, throwError, BehaviorSubject } from 'rxjs';
import { AppConfiguration } from 'read-appsettings-json';

@Injectable({
  providedIn: 'root',
})
export class HttpuserdataService implements OnInit{
  private url: string = AppConfiguration.Setting().url;
  public isConnecting = new BehaviorSubject<boolean>(false);
  public userdata = new BehaviorSubject<UserData[] | null>(null);
  public userlog = new BehaviorSubject<Userlog[] | null>(null);
  public userlogtable = new BehaviorSubject<UserlogTable[] | null>(null);

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isConnecting = new BehaviorSubject<boolean>(false);
  }
  //抓取後端資料
  public getuserdata() {
    //傳送HTTP請求
    return this.http.get<UserData[]>(this.url + 'userdata').pipe(
      catchError(this.handleError.bind(this)),
      tap((resData) => {
        this.isConnecting.next(true);
        this.userdata.next(resData);
      })
    );
  }
  public getuserlog() {
    return this.http.get<Userlog[]>(this.url + 'UserLog').pipe(
      catchError(this.handleError.bind(this)),
      tap((resData) => {
        this.isConnecting.next(true);
        this.userlog.next(resData);
      })
    );
  }
  public getuserlogtable() {
    return this.http.get<UserlogTable[]>(this.url + 'UserLog/table').pipe(
      catchError(this.handleError.bind(this)),
      tap((resData) => {
        this.isConnecting.next(true);
        this.userlogtable.next(resData);
      })
    );
  }
  public addUserdata(data: UserData) {
    const _data = new FormData();
    _data.append('ID', data.id);
    _data.append('chineseName', data.chineseName);
    _data.append('englishName', data.englishName);
    _data.append('grade', String(data.grade));
    _data.append('gender', data.gender.toString());
    _data.append('position', data.position);
    _data.append('email', data.email);
    _data.append('view', data.view);
    if (data.Image) {
      for (let index = 0; index < data.Image.length; index++) {
        _data.append('Image', data.Image[index]);
      }
    }
    return this.http.post<String>(this.url + 'userdata', _data).pipe(
      catchError(this.handleError.bind(this)),
      tap(() => {
        this.isConnecting.next(true);
        this.getuserdata().subscribe();
        this.getuserlog().subscribe();
        this.getuserlogtable().subscribe();
      })
    );
  }

  public updateUserdata(data: UserData) {
    console.log(data);

    const _data = new FormData();
    _data.append('ID', data.id);
    _data.append('chineseName', data.chineseName);
    _data.append('englishName', data.englishName);
    _data.append('grade', String(data.grade));
    _data.append('gender', data.gender.toString());
    _data.append('position', data.position);
    _data.append('email', data.email);
    _data.append('view', data.view);
    return this.http.put(this.url + 'userdata', _data).pipe(
      catchError(this.handleError.bind(this)),
      tap(() => {
        this.isConnecting.next(true);
        this.getuserdata().subscribe();
        this.getuserlog().subscribe();
        this.getuserlogtable().subscribe();
      })
    );
  }
  public deluser(ID: string) {
    return this.http.delete(this.url + 'userdata/' + ID).pipe(
      catchError(this.handleError.bind(this)),
      tap(() => {
        this.isConnecting.next(true);
        this.getuserdata().subscribe();
        this.getuserlog().subscribe();
        this.getuserlogtable().subscribe();
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
      this.isConnecting.next(false);
      return throwError(() => errorMessage);
    }
    this.isConnecting.next(true);
    switch (errorRes.error) {
      case 'ID':
        errorMessage = '未找到此人ID';
        break;
      case 'nullimg':
        errorMessage = '照片上傳失敗';
        break;
      case 'isID':
        errorMessage = '此ID已存在';
        break;
      case 'facenull':
        errorMessage = '請更換照片再試';
        break;
      case 'Position':
        errorMessage = '身分輸入錯誤';
        break;
      case 'email':
        errorMessage = 'Email輸入錯誤';
        break;
    }
    return throwError(() => errorMessage);
  }
}
