import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import * as Components from './components';
import * as Pipes from './pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatBottomSheetModule,
    Ng5SliderModule,
    NgxMatSelectSearchModule,
    RouterModule,
  ],
  declarations: [
    Pipes.CustomNumberPipe,
    Pipes.YesNoPipe,
    Components.ConfirmActionDialogComponent,
    Components.PopoverComponent,
    Components.LogoComponent,
    Components.InputFilterComponent,
    Components.PageNotFoundComponent,
    Components.InfoIconComponent,
    Components.CustomDatePickerHeaderComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatBottomSheetModule,
    Ng5SliderModule,
    NgxMatSelectSearchModule,
    Pipes.CustomNumberPipe,
    Pipes.YesNoPipe,
    Components.ConfirmActionDialogComponent,
    Components.PopoverComponent,
    Components.LogoComponent,
    Components.InputFilterComponent,
    Components.PageNotFoundComponent,
    Components.InfoIconComponent,
    Components.CustomDatePickerHeaderComponent,
  ],
  entryComponents: [
    Components.ConfirmActionDialogComponent,
    Components.PopoverComponent,
  ],
  providers: [
    Pipes.CustomNumberPipe,
  ],
})
export class SharedModule {
}
