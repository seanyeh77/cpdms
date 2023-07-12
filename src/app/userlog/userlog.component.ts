import { HttpuserdataService } from './../services/httpuserdata.service';
import { Userlog } from './../interfaces/userlog';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-userlog',
  templateUrl: './userlog.component.html',
  styleUrls: ['./userlog.component.css'],
})
export class UserlogComponent implements OnInit {
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private httpuserdataService: HttpuserdataService,
    private snackBar: MatSnackBar
  ) {}
  isLoading = false;
  @Input() userid?: String[];
  dataSource = new MatTableDataSource<Userlog>();
  displayedColumns = ['id', 'time', 'state'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  openSnackBar(message: string) {
    this.snackBar.open(message, '確定', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.httpuserdataService.getuserlog().subscribe(
      () => {
        this.isLoading = false;
      },
      (error) => {
        this.openSnackBar(error);
        this.isLoading = false;
      }
    );
    this.httpuserdataService.userlog.subscribe((userlog) => {
      if (!!userlog) {
        this.dataSource.data = this.userid
          ? userlog.filter((res) => this.userid!.includes(res.id))
          : userlog;
      }
    });
  }
  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource<Userlog>(this.dataSource.data);
  }
  ngAfterViewChecked(): void {
    // this.dataSource.data = this.data;
    if (!(this.dataSource.paginator === this.paginator)) {
      //當Table被重新整理時
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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

  formatTime(date: Date | string) {
    if (typeof date === 'string') {
      date = new Date(date);
    }

    if (!isNaN(date.getTime())) {
      return this.formatter.format(date);
    }
    return '';
  }
}
