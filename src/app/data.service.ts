import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import Task, { BoardList } from './Task';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private items: Task[] = [];
  public items$: Subject<Task[]> = new Subject<Task[]>();


  public addItem(taskName: string) {
    const task: Task = {
      title: taskName,
      list: BoardList.Backlog,
      selected: false
    }

    this.items.push(task);
    this.emitItems();
  }

  public moveTo(list: string) {   
    console.log('Moving to:', list); 
    this.items.filter(task => task.selected === true).forEach(task => {
      task.list = list as BoardList;
      task.selected = false;
      console.log('Task:', task);
    });
    this.emitItems();
  }

  private emitItems() {
    this.items$.next(this.items);
  }


  constructor() { }
}
