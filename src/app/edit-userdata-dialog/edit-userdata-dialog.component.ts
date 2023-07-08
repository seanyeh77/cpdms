import { HttpuserdataService } from './../services/httpuserdata.service';
import { Gender, Position, UserData } from './../interfaces/userdata';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-userdata-dialog',
  templateUrl: './edit-userdata-dialog.component.html',
  styleUrls: ['./edit-userdata-dialog.component.css'],
})
export class EditUserdataDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EditUserdataDialogComponent>,
    private httpuserdataService: HttpuserdataService,
    @Inject(MAT_DIALOG_DATA) public data: UserData,
    private _snackBar: MatSnackBar
  ) {}

  openSnackBar(message: string) {
    this._snackBar.open(message, '確定', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  isLoading = false;
  form: FormGroup = new FormGroup({
    id: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(/^\S.*\S$/),
    ]),
    chineseName: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S.*\S$/),
    ]),
    englishName: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S.*\S$/),
    ]),
    gender: new FormControl('', [
      Validators.required,
      Validators.pattern('男|女'),
    ]),
    grade: new FormControl('', [
      Validators.pattern('[0-9]{1,2}'),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S.*\S$/),
      Validators.email,
    ]),
    position: new FormControl('', [
      Validators.required,
      Validators.pattern('學生|老師|其他'),
      Validators.pattern(/^\S.*\S$/),
    ]),
    view: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S.*\S$/),
    ]),
  });

  ngOnInit(): void {
    this.form.patchValue({
      id: this.data.id as string,
      chineseName: this.data.chineseName as string,
      englishName: this.data.englishName as string,
      grade: String(this.data.grade) as string,
      gender: this.data.gender as Gender,
      email: this.data.email as string,
      position: this.data.position as Position,
      view: this.data.view as string,
    });
    this.form.updateValueAndValidity();
  }
  onSumit() {
    console.log(this.form.value);

    this.isLoading = true;
    this.httpuserdataService
      .updateUserdata(this.form.value as UserData)
      .subscribe(
        (data) => {
          this.openSnackBar('修改成功');
          this.isLoading = false;

          this.dialogRef.close();
        },
        (error) => {
          this.openSnackBar(error.message);
          this.isLoading = false;
        }
      );
  }
  getErrorMessage(type: string) {
    switch (type) {
      case 'chineseName':
        if (this.form.get('chineseName')?.hasError('required')) {
          return '不可為空白';
        } else if (this.form.get('chineseName')?.hasError('pattern')) {
          return '前後不可輸入空格';
        }
        break;
      case 'englishName':
        if (this.form.get('englishName')?.hasError('required')) {
          return '不可為空白';
        } else if (this.form.get('englishName')?.hasError('pattern')) {
          return '前後不可輸入空格';
        }
        break;
      case 'grade':
        if (this.form.get('grade')?.hasError('required')) {
          return '不可為空白';
        } else if (this.form.get('grade')?.hasError('pattern')) {
          return '年級只能是1~2位數字';
        }
        break;
      case 'gender':
        if (this.form.get('gender')?.hasError('required')) {
          return '不可為空白';
        } else if (this.form.get('gender')?.hasError('pattern')) {
          return '性別只能是男或女';
        }
        break;
      case 'email':
        if (this.form.get('email')?.hasError('required')) {
          return '不可為空白';
        } else if (this.form.get('email')?.hasError('email')) {
          return '請輸入正確的帳號';
        } else if (this.form.get('email')?.hasError('pattern')) {
          return '前後不可輸入空格';
        }
        break;
      case 'position':
        if (this.form.get('position')?.hasError('required')) {
          return '不可為空白';
        } else if (this.form.get('position')?.hasError('pattern')) {
          return '前後不可輸入空格';
        }
        break;
      case 'view':
        if (this.form.get('view')?.hasError('required')) {
          return '不可為空白';
        } else if (this.form.get('view')?.hasError('pattern')) {
          return '前後不可輸入空格';
        }
        break;
    }
    return;
  }
}
