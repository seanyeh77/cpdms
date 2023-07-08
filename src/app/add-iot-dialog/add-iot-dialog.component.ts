import { IotService } from './../services/Iot.service';
import { Component, Inject } from '@angular/core';
import { Iotstate } from '../interfaces/iotstate';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-iot-dialog',
  templateUrl: './add-iot-dialog.component.html',
  styleUrls: ['./add-iot-dialog.component.css'],
})
export class AddIotDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddIotDialogComponent>,
    private iotService: IotService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IotService
  ) {}
  isLoading = false;
  form: FormGroup = new FormGroup({
    type: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S.*\S$/),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S.*\S$/),
    ]),
    deadline: new FormControl('', [Validators.required]),

  });


  ngOnInit(): void {}

  onSubmit() {
    this.isLoading = true;
      const iot: Iotstate = this.form.value;
      console.log(iot);
      this.iotService.addIot(iot).subscribe(
        () => {
          this.openSnackBar('以成功新增 ' + iot.name);
          this.isLoading = false;
          this.dialogRef.close();
        },
        (errorRes) => {
          this.openSnackBar(errorRes);
          this.isLoading = false;
        }
      );
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, '確定', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  //取得個欄位發生的錯誤訊息
  getErrorMessage(type: string) {
    switch (type) {
      case 'id':
        if (this.form.get('id')?.hasError('required')) {
          return '不可為空白';
        } else if (this.form.get('id')?.hasError('minlength')) {
          return '學號需6位數';
        } else if (this.form.get('id')?.hasError('maxLength')) {
          return '學號只需6位數';
        }
        break;
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
