import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { CustomTableComponent } from './custom-table.component';
import { CustomTableService } from './custom-table.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    CustomTableComponent,
  ],
  exports: [
    CustomTableComponent,
  ],
  providers: [
    CustomTableService,
  ],
})
export class CustomTableModule {
}
