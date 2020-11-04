import { Component, OnInit, Input } from '@angular/core';
import Task from '../Task';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  public selected: boolean;
  @Input() cardTask: Task;

  constructor() { }

  ngOnInit() { }

  onClick() {
    this.selected = !this.selected;
    this.cardTask.selected = this.selected;
  }

}
