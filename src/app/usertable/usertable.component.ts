import { AuthService } from './../auth/auth.service';
import { HttpuserdataService } from './../services/httpuserdata.service';
import { UserData } from '../interfaces/userdata';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditUserdataDialogComponent } from '../edit-userdata-dialog/edit-userdata-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css'],
})
export class UsertableComponent implements OnInit {
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private httpuserdataService: HttpuserdataService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  dataSource = new MatTableDataSource<UserData>();
  private userSub: Subscription = new Subscription();
  private userdataSub: Subscription = new Subscription();
  isAuthenticated = false;
  isLoading = false;
  isConnecting = false;
  openSnackBar(message: string) {
    this.snackBar.open(message, '確定', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  ngOnInit() {
    this.isLoading = true;
    //共用變數userdata值被更改事件
    this.userdataSub = this.httpuserdataService.userdata.subscribe(
      (resData) => {  //更改後的值
        if (!!resData) {
          this.dataSource.data = resData;
        }
      }
    );
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    this.httpuserdataService.isConnecting.subscribe((isConnected) => {
      this.isConnecting = isConnected;
    });
    //訂閱資料
    this.httpuserdataService.getuserdata().subscribe({
      next: () => (this.isLoading = false),
      error: (err) => {
        this.isLoading = false;
        this.openSnackBar(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.userdataSub.unsubscribe();
  }

  edituser(user: UserData) {
    // 開啟修改成員資料對話視窗
    const dialogRef = this.dialog.open(EditUserdataDialogComponent, {
      data: user,
    });
    // 接收 dialogRef傳回的值
    dialogRef.afterClosed().subscribe(() => {});
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
