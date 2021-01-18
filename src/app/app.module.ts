import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AuthModule } from '@auth/auth.module';
import { MapResolver, ThresholdsResolver } from '@core/resolvers';
import { SharedModule } from '@shared/shared.module';
import { NgProgressModule } from 'ngx-progressbar';

import { ModuleRouting } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ToolbarComponent } from './toolbar';

@NgModule({
  imports: [
    NgProgressModule,
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    ModuleRouting,
    AuthModule,
    CoreModule,
    LeafletModule,
  ],
  declarations: [
    AppComponent,
    ToolbarComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    MapResolver,
    ThresholdsResolver,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class AppModule { }
