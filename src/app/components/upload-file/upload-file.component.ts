import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/compat/storage";
import {finalize, lastValueFrom, Observable, tap} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";

export interface UploadState {
  status: boolean
}

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['../chat-bar/chat-bar.component.css']
})
export class UploadFileComponent implements OnInit, OnChanges {
  @Input() image: any | undefined;
  @Input() isUpload: UploadState | undefined;
  @Output() sendImage = new EventEmitter();
  @Output() removeImage = new EventEmitter();
  task: AngularFireUploadTask | undefined;
  snapshot: Observable<any> | undefined;
  percentage: Observable<any> | undefined;
  downloadURL: string | undefined;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isUpload']) this.upload();
  }

  ngOnInit(): void {
    if (this.isUpload?.status) this.upload();
  }

  handleRemoveImage(image: any) {
    this.removeImage.emit(image);
  }

  upload() {
    if (this.isUpload?.status && this.image.file) {
      const path = `${new Date().getTime()}-${this.image.file.name}`;
      const ref = this.storage.ref(path);
      this.task = this.storage.upload(path, this.image.file);
      this.percentage = this.task.percentageChanges();
      this.snapshot = this.task.snapshotChanges().pipe(
        finalize(async () => {
          this.downloadURL = await lastValueFrom(ref.getDownloadURL());
          if (this.downloadURL) await this.sendImage.emit({...this.image, downloadURL: this.downloadURL})
        })
      )
      this.percentage.subscribe();
      this.snapshot.subscribe();
    }
  }
}
