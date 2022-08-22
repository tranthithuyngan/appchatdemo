import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UploadState} from "../upload-file/upload-file.component";

@Component({
  selector: 'app-chat-bar',
  templateUrl: './chat-bar.component.html',
  styleUrls: ['./chat-bar.component.css']
})
export class ChatBarComponent implements OnInit {
  message: string = '';
  icons: any[] = [];
  isEmojiPickerVisible: boolean | undefined;
  images: any = [];
  isUpload: UploadState = {status: false};
  private countImage: number = 0;
  @Output() sendChat = new EventEmitter();
  style: String = "";

  constructor() {
  }

  ngOnInit(): void {
  }

  async handleSendChat() {
    if (this.images.length > 0) {
      this.isUpload = {status: true};
    } else {
      await this.sendMessage();
    }
  }

  async sendMessage() {
    if (this.message) {
      this.icons.forEach((icon: any) => this.message = this.message.replace(icon.native, icon.unified))
      this.sendChat.emit(this.message);
      this.reset();
    }
  }

  async sendImage(image: any) {
    if (image.downloadURL) {
      this.countImage++;
      const html = `<img src='${image.downloadURL}' alt="send image">`
      await this.sendChat.emit(html);
      if (this.countImage >= this.images.length) this.images = [];
      if (this.images.length <= 0) await this.sendMessage();
    }
  }

  reset() {
    this.message = '';
    this.icons = [];
    this.images = [];
  }

  chooseFile(event: any) {
    if (event.target.files) {
      const images = event.target.files;
      Array.from(images).forEach((file: any) => {
        const image = {file}
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          this.images.push({...image, url: event.target.result})
        }
      })
    }
  }

  removeImage(image: any) {
    this.images = this.images.filter((item: any) => {
      return item !== image
    });
  }

  addEmoji(event: any) {
    if (event?.emoji?.native) {
      let icon = {
        begin: this.message.length,
        native: event.emoji.native,
        unified: `&#x${event.emoji.unified.split('-')[0]};`,
      }
      this.message += event.emoji.native;
      this.icons.push(icon);
    }
  }

  toggleEmoji() {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
    this.style = document.getElementsByTagName('body')[0].classList.value;
  }

}
