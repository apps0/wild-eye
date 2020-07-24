import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/shared';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messageList: any[] = [
    {
      displayName: 'Sachin',
      photoURL:
        'https://lh3.googleusercontent.com/a-/AOh14GgGSkGSLOuaXDAQZQ6ocQqPwSHlao6A2i27Zr2i',
      text: 'Hii',
      uid: 'FnqgoczVPiayCq2xul5XFsHJ3f72',
      time: new Date(),
    },
  ];
  chatInput: FormControl = new FormControl('', Validators.required);
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // this.chatService.getMessages().subscribe(messages => {
    //   this.messageList = messages;
    // });
  }
  sendMessage() {
    if (this.chatInput.valid) {
      this.messageList.push({
        displayName: 'Sachin',
        photoURL:
          'https://lh3.googleusercontent.com/a-/AOh14GgGSkGSLOuaXDAQZQ6ocQqPwSHlao6A2i27Zr2i',
        text: this.chatInput.value,
        uid: 'FnqgoczVPiayCq2xul5XFsHJ3f72',
        time: new Date(),
      });
      this.chatInput.reset();
    }
  }
}
