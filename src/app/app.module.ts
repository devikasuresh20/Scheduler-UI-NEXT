import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CoreModule } from './app-modules/core/core.module';
import { CommonModule } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';
import { MatMenuModule } from '@angular/material/menu';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    FullCalendarModule,
    // FullCalendarComponent,
    MatDatepickerModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    WebcamModule,
    MatMenuModule,
    NgChartsModule,
    CoreModule.forRoot(),
  ],
  providers: [
    // HttpClient,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpInterceptorService,
    //   multi: true,
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
