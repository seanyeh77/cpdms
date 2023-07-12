import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserlogTable } from '../interfaces/user-data';

@Component({
  selector: 'app-userlog-dialog',
  templateUrl: './userlog-dialog.component.html',
  styleUrls: ['./userlog-dialog.component.css'],
})
export class UserlogDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserlogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserlogTable
  ) {}
}
