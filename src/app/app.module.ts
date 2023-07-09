import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { TableUserdataComponent } from './table-userdata/table-userdata.component';
import { NgChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { DelcheckComponent } from './delcheck/delcheck.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UsertableComponent } from './usertable/usertable.component';
import { ReplaceNewLinePipe } from './replace-new-line-pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserlogComponent } from './userlog/userlog.component';
import { IotstatetableComponent } from './iotstatetable/iotstatetable.component';
import { UserlogDialogComponent } from './userlog-dialog/userlog-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule, Routes } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthSignupComponent } from './auth-signup/auth-signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthGuard } from './auth/auth.guard';
import { EditUserdataDialogComponent } from './edit-userdata-dialog/edit-userdata-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { AddUserdataDialogComponent } from './add-userdata-dialog/add-userdata-dialog.component';
import { DelIotDialogComponent } from './del-iot-dialog/del-iot-dialog.component';
import { AddIotDialogComponent } from './add-iot-dialog/add-iot-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

const routes: Routes = [
  { path: '', component: UsertableComponent },
  { path: 'userlog', canActivate: [AuthGuard], component: UserlogComponent },
  { path: 'tableUserdata', component: TableUserdataComponent },
  { path: 'iotstatetable', component: IotstatetableComponent },
  { path: 'signup', component: AuthSignupComponent },
  { path: 'login', component: AuthLoginComponent },
  { path: 'test', component: EditUserdataDialogComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    TableUserdataComponent,
    DelcheckComponent,
    UsertableComponent,
    ReplaceNewLinePipe,
    UserlogComponent,
    IotstatetableComponent,
    UserlogDialogComponent,
    AuthLoginComponent,
    AuthSignupComponent,
    EditUserdataDialogComponent,
    AddUserdataDialogComponent,
    DelIotDialogComponent,
    IotstatetableComponent,
    AddIotDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgChartsModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
