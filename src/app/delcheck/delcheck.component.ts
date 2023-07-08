import { UserlogTable } from './../interfaces/user-data';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpuserdataService as HttpUserDataService } from '../services/httpuserdata.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-delcheck',
  templateUrl: './delcheck.component.html',
  styleUrls: ['./delcheck.component.css'],
})
export class DelcheckComponent {
  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DelcheckComponent>,
    private httpUserDataService: HttpUserDataService,
    @Inject(MAT_DIALOG_DATA) public data: UserlogTable
  ) {}
  openSnackBar(message: string) {
    this.snackBar.open(message, '確定', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  deluser() {
    this.httpUserDataService.deluser(this.data.id).subscribe(
      () => {
        this.openSnackBar('成功刪除');
      },
      (errorRes) => {
        this.openSnackBar(errorRes);
      }
    );
  }
}
