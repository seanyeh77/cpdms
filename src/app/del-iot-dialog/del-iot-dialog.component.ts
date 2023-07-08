import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Iotstate } from '../interfaces/iotstate';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IotService } from '../services/Iot.service';

@Component({
  selector: 'app-del-iot-dialog',
  templateUrl: './del-iot-dialog.component.html',
  styleUrls: ['./del-iot-dialog.component.css'],
})
export class DelIotDialogComponent {
  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DelIotDialogComponent>,
    private iotService: IotService,
    @Inject(MAT_DIALOG_DATA) public data: Iotstate
  ) {}
  openSnackBar(message: string) {
    this.snackBar.open(message, '確定', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  delIot() {
    this.iotService.deliot(this.data.iotid).subscribe(
      () => {
        this.openSnackBar('成功刪除');
      },
      (errorRes) => {
        this.openSnackBar(errorRes);
      }
    );
  }
}
