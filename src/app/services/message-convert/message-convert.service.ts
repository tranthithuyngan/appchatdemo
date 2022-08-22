import {Injectable} from '@angular/core';

export interface Message {
  id: number,
  name: string,
  type: number,
  to: string,
  mes: string,
  createAt: string,
}

@Injectable({
  providedIn: 'root'
})
export class MessageConvertService {
  public tokenForward: string = '/AIzaSyCR44lmiTtk7Oy/'

  constructor() {
  }

  convertMessage(message: Message): string {
    const doc = new DOMParser().parseFromString(message.mes, "text/html");
    const isHtml = Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
    if (isHtml) {
      return 'Send a image'
    }
    return message.mes;
  }

  isHtml(message: Message): boolean {
    const doc = new DOMParser().parseFromString(message.mes, "text/html");
    return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
  }

  convertMes(message: string): string {
    const doc = new DOMParser().parseFromString(message, "text/html");
    const isHtml = Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
    if (isHtml) {
      return 'Send a image'
    }
    return message;
  }
}
