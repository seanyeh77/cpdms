import { HttpuserdataService } from './../services/httpuserdata.service';
import { UserData } from './../interfaces/userdata';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-userdata-dialog',
  templateUrl: './add-userdata-dialog.component.html',
  styleUrls: ['./add-userdata-dialog.component.css'],
})
export class AddUserdataDialogComponent implements OnInit {
  @Output() uploadFiles: EventEmitter<FileList> = new EventEmitter<FileList>();
  @ViewChild('inputForm') readonly inputForm!: any;
  constructor(
    public dialogRef: MatDialogRef<AddUserdataDialogComponent>,
    private httpuserdataService: HttpuserdataService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: UserData
  ) {}
  isLoading = false;
  form: FormGroup = new FormGroup({
    id: new FormControl('000000' as string, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(/^\S.*\S$/),
    ]),
    chineseName: new FormControl('測試', [
      Validators.required,
      Validators.pattern(/^\S.*\S$/),
    ]),
    englishName: new FormControl('test', [
      Validators.required,
      Validators.pattern(/^\S.*\S$/),
    ]),
    gender: new FormControl('男', [
      Validators.required,
      Validators.pattern('男|女'),
    ]),
    grade: new FormControl('11', [Validators.pattern('[0-9]{1,2}')]),
    email: new FormControl('s010597@go.pymhs.tyc.edu.tw', [
      Validators.required,
      Validators.email,
    ]),
    position: new FormControl('老師', [
      Validators.required,
      Validators.pattern('學生|老師|其他'),
    ]),
    view: new FormControl('test', [
      Validators.required,
      Validators.pattern(/^\S.*\S$/),
    ]),
    Image: new FormControl(null, [
      Validators.required,
      this.fileTypeValidator(),
    ]),
  });

  files!: FileList;
  fileLabel: string = '';
  multipleFilesAccepted = true;

  ngOnInit(): void {}

  onSubmit() {
    this.isLoading = true;
    if (this.fileLabel !== '') {
      const user: UserData = this.form.value;
      user.Image = [this.files[0]];
      this.httpuserdataService.addUserdata(user).subscribe(
        () => {
          this.openSnackBar('以成功新增 ' + user.chineseName);
          this.isLoading = false;

          this.dialogRef.close();
        },
        (errorRes) => {
          this.openSnackBar(errorRes);
          this.isLoading = false;
        }
      );
    }
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
      case 'Image':
        if (this.form.get('Image')?.hasError('required')) {
          return '不可為空白';
        } else if (this.form.get('Image')?.hasError('invalidFileType')) {
          return '檔案類型錯誤';
        }
        break;
    }
    return;
  }

  //驗證檔案類型
  fileTypeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (file) {
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = file.toString().split('.')[1];

        if (!allowedExtensions.includes(fileExtension)) {
          return { invalidFileType: true };
        }
      }
      return null;
    };
  }

  onSelectFiles(event: any): void {
    this.files = event.target.files ?? null;
    this.fileLabel = this.getFilesLabel();
  }

  getFilesName() {
    return this.fileLabel;
  }

  getFilesLabel(): string {
    const filesSelected = this.files?.length;
    switch (filesSelected) {
      case 0:
        return 'No file selected';
      default:
        return this.files[0].name;
    }
  }

  onUploadFiles(): void {
    this.uploadFiles.next(this.files);
    this.inputForm.nativeElement.reset();
  }
}
