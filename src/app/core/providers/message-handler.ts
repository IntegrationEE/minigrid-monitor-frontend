import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HTTP, MessageType } from '@shared/enums';
import { AppConst } from 'app/app.const';

@Injectable({
  providedIn: 'root',
})
export class MessageHandler {
  constructor(private snackbar: MatSnackBar) { }

  handleError(err: HttpErrorResponse) {
    if (err.error) {
      if (typeof err.error === 'string') {
        try {
          const error: string = JSON.parse(err.error);

          this.handleMessageError(error['message']);
        } catch {
          this.handleMessageError(err.error);
        }
      } else if ('application/json' === err.headers.get('Content-Type') && err.error instanceof Blob) {
        const reader = new FileReader();

        reader.addEventListener('loadend', (event: ProgressEvent) => {
          // tslint:disable-next-line: deprecation
          this.handleMessageError(JSON.parse(event.srcElement['result']).message);
        });
        reader.readAsText(err.error);
      } else if (err.error.message) {
        this.handleMessageError(err.error.message);
      } else if (err.error.error_description) {
        this.handleMessageError(err.error.error_description);
      }
    } else if (err.status === 401) {
      this.handleMessageError(err.statusText);
    } else {
      this.handleMessageError(err.message);
    }
  }

  handleSuccess(message: string) {
    this.snackbar.open(message, AppConst.MESSAGE_BUTTON.CONFIRM, this.getConfig(MessageType.SUCCESS));
  }

  handleInfo(action: HTTP, entity: string) {
    this.snackbar.open(`${entity} just have been ${this.getAction(action)}!`,
      AppConst.MESSAGE_BUTTON.OK,
      this.getConfig(MessageType.INFO));
  }

  handleMessageError(message: string) {
    this.snackbar.open(message, AppConst.MESSAGE_BUTTON.CLOSE, this.getConfig(MessageType.ERROR));
  }

  handleMessageInfo(message: string) {
    this.snackbar.open(message, AppConst.MESSAGE_BUTTON.OK, this.getConfig(MessageType.INFO));
  }

  hide() {
    this.snackbar.dismiss();
  }

  private getAction(action: HTTP) {
    switch (action) {
      case HTTP.POST:
        return 'created';
      case HTTP.PATCH:
        return 'updated';
      case HTTP.DELETE:
        return 'deleted';
    }
  }

  private getConfig(type: MessageType): MatSnackBarConfig {
    return {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: this.getDuration(type),
    };
  }

  private getDuration(type: MessageType): number {
    switch (type) {
      case MessageType.SUCCESS:
        return AppConst.MESSAGE_DURATION.SUCCESS;
      case MessageType.INFO:
        return AppConst.MESSAGE_DURATION.INFO;
      case MessageType.ERROR:
        return AppConst.MESSAGE_DURATION.ERROR;
    }
  }
}
