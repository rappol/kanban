import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DataService } from '../services/data.service';
import Task, { BoardList } from '../Task';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  backlogTasks$: Observable<Task[]>;
  todoTasks$: Observable<Task[]>;
  doingTasks$: Observable<Task[]>;
  doneTasks$: Observable<Task[]>;


  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.backlogTasks$ = this.dataService.items$.pipe(
      map(tasks => tasks.filter(task => task.list === BoardList.Backlog)),
      // tap(rst => console.log('backlog task updated', rst))
    );

    this.todoTasks$ = this.dataService.items$.pipe(
      map(tasks => tasks.filter(task => task.list === BoardList.ToDo)),
      // tap(rst => console.log('todo task updated', rst))
    );

    this.doingTasks$ = this.dataService.items$.pipe(
      map(tasks => tasks.filter(task => task.list === BoardList.Doing)),
      // tap(rst => console.log('doing task updated', rst))
    );

    this.doneTasks$ = this.dataService.items$.pipe(
      map(tasks => tasks.filter(task => task.list === BoardList.Done)),
      // tap(rst => console.log('done task updated', rst))
    );
  }

}
