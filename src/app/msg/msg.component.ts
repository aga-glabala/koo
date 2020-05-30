import { Component, OnInit } from '@angular/core';
import { MsgService } from '../msg.service';

@Component({
  selector: 'koo-msg',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.scss']
})
export class MsgComponent implements OnInit {

  constructor(public toastService: MsgService) { }

  ngOnInit(): void {
  }

}
