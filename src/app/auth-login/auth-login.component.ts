import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css'],
})
export class AuthLoginComponent {
  openSnackBar(message: string) {
    this._snackBar.open(message, '確定', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}
  isLoginMode = false;
  isLoading = false;
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  getErrorMessage(type: string) {
    switch (type) {
      case 'email':
        if (this.form.get('email')?.hasError('required')) {
          return '不可為空白';
        } else if (this.form.get('email')?.hasError('email')) {
          return '請輸入正確的帳號';
        }
        break;
      case 'password':
        if (this.form.get('password')?.hasError('required')) {
          return '不可為空白';
        } else if (this.form.get('password')?.hasError('minlength')) {
          return '密碼至少需8位數';
        }
        break;
    }
    return;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const email = this.form.get('email')?.value;
    const passward = this.form.get('password')?.value;
    if (this.isLoginMode) {
    } else {
      this.authService.login(email, passward).subscribe(
        (resData) => {
          this.openSnackBar('成功登入');
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        (errorRes) => {
          this.openSnackBar(errorRes);
          this.isLoading = false;
        }
      );
    }
    this.form.reset();
  }
}
