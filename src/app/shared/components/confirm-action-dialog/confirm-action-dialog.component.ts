import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IConfirmDialogConfig } from './confirm-action-dialog.interface';

@Component({
  selector: 'app-confirm-action-dialog',
  templateUrl: './confirm-action-dialog.component.html',
  styleUrls: ['./confirm-action-dialog.component.scss'],
})
export class ConfirmActionDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() action: string;
  @Input() cancel: string;

  constructor(public dialogRef: MatDialogRef<ConfirmActionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: IConfirmDialogConfig) {
  }

  ngOnInit() {
    this.title = this.data.title;
    this.message = this.data.message;
    this.action = this.data.action;
    this.cancel = this.data.cancel;
  }
}
