import { HttpuserdataService } from './../services/httpuserdata.service';
import { Iotstate } from './../interfaces/iotstate';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IotService } from '../services/Iot.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DelIotDialogComponent } from '../del-iot-dialog/del-iot-dialog.component';
import { AddIotDialogComponent } from '../add-iot-dialog/add-iot-dialog.component';

@Component({
  selector: 'app-iotstatetable',
  templateUrl: './iotstatetable.component.html',
  styleUrls: ['./iotstatetable.component.css'],
})
export class IotstatetableComponent {
  isLoading = false;
  private iotSub: Subscription = new Subscription();
  private userSub: Subscription = new Subscription();
  isAuthenticated = false;
  isConnecting = false;
  title = '機器資料';
  isMobile: boolean = false;
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public iotService: IotService,
    private httpuserdataService: HttpuserdataService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  formatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  displayedColumns: string[] = [
    'iotid',
    'type',
    'deadline',
    'name',
    'state',
    'id',
    'action',
  ];
  dataSource = new MatTableDataSource<Iotstate>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit() {
    this.isLoading = true;
    this.iotService.startConnection();
    this.iotService.addTransferChartDataListener();
    this.iotService.getiot().subscribe(
      (ResData) => {
        this.isLoading = false;
      },
      (error) => {
        this.openSnackBar(error);
        this.isLoading = false;
      }
    );
    this.httpuserdataService.isConnecting.subscribe((isConnect) => {
      this.isConnecting = isConnect;
    });
    this.iotSub = this.iotService.iotstate.subscribe((iotstate) => {
      if (!!iotstate) {
        this.dataSource.data = iotstate;
      }
    });
    this.isMobile = window.innerWidth < 900;
    window.onresize = () => {
      this.isMobile = window.innerWidth < 900;
    };
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      if (!this.isAuthenticated) {
        let index: number = this.displayedColumns.indexOf('action');
        if (index !== -1) {
          this.displayedColumns.splice(index, 1);
        }
      } else {
        let index: number = this.displayedColumns.indexOf('action');
        if (index === -1) {
          this.displayedColumns.push('action');
        }
      }
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

  openSnackBar(message: string) {
    this.snackBar.open(message, '確定', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  AddOnClick() {
    const dialogRef = this.dialog.open(AddIotDialogComponent);
    dialogRef.afterClosed();
  }

  DeleteIot(iot: Iotstate) {
    const dialogRef = this.dialog.open(DelIotDialogComponent, {
      data: iot,
    });
    dialogRef.afterClosed();
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
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.iotSub.unsubscribe();
  }

  formatTime(date: Date | string) {
    if (typeof date === 'string') {
      date = new Date(date);
    }

    if (!isNaN(date.getTime())) {
      return this.formatter.format(date);
    }
    return ''; // 或者您可以返回一个默认值或错误消息
  }
}
