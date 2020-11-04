import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../data.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {


  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  createTask(taskName: string) {
    if (taskName !== '') {
      this.dataService.addItem(taskName);
    }
  }

  moveTo(list: string) {
    this.dataService.moveTo(list);
  }

}
