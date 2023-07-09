import { UserlogDialogComponent } from './../userlog-dialog/userlog-dialog.component';
import { HttpuserdataService } from './../services/httpuserdata.service';
import { MatDialog } from '@angular/material/dialog';
import { UserlogTable } from './../interfaces/user-data';
import { Component, ViewChild, OnInit, AfterViewChecked } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { IotService } from '../services/Iot.service';
import { DelcheckComponent } from '../delcheck/delcheck.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AddUserdataDialogComponent } from '../add-userdata-dialog/add-userdata-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-table-userdata',
  templateUrl: './table-userdata.component.html',
  styleUrls: ['./table-userdata.component.css'],
})
export class TableUserdataComponent implements OnInit, AfterViewChecked {
  private logSub: Subscription = new Subscription();
  private userSub: Subscription = new Subscription();
  isAuthenticated = false;
  isMobile: boolean = false;
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public signalRService: IotService,
    private dialog: MatDialog,
    private httpuserdataService: HttpuserdataService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}
  displayedColumns: string[] = [
    'chineseName',
    'id',
    'grade',
    'dayaverage',
    'monaverage',
    'notcheckday',
    'totaleverydayminute',
    'state',
    'action',
  ];
  isLoading = false;
  isConnecting: boolean = false;
  dataSource = new MatTableDataSource<UserlogTable>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  openSnackBar(message: string) {
    this.snackBar.open(message, '確定', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.httpuserdataService.isConnecting.subscribe((isConnect) => {
      this.isConnecting = isConnect;
    });
    this.logSub = this.httpuserdataService.userlogtable.subscribe(
      (userlogtable) => {
        if (!!userlogtable) {
          this.dataSource.data = userlogtable;
        }
      }
    );
    this.httpuserdataService.getuserlogtable().subscribe(
      (userlogtable) => {
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.openSnackBar(error);
      }
    );

    this.isMobile = window.innerWidth < 900;
    window.onresize = () => {
      this.isMobile = window.innerWidth < 900;
    };
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }
  ngAfterViewChecked(): void {
    if (!(this.dataSource.paginator === this.paginator)) {
      //當Table被重新整理時
      if (!this.isMobile) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
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
  Visibility(user: string) {
    const dialogRef = this.dialog.open(UserlogDialogComponent, {
      data: [user],
    });
    dialogRef.afterClosed();
  }
  AddOnClick() {
    const dialogRef = this.dialog.open(AddUserdataDialogComponent);
    dialogRef.afterClosed();
  }
  Deletedata(chineseName: string, id: string) {
    const dialogRef = this.dialog.open(DelcheckComponent, {
      data: { chineseName: chineseName, id: id },
    });
    dialogRef.afterClosed();
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.logSub.unsubscribe();
  }
}
