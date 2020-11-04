export default interface Task {
  title: string;
  list: BoardList;
  selected: boolean;
}

export enum BoardList {
  Backlog = 'backlog',
  ToDo = 'todo',
  Doing = 'doing',
  Done = 'done'
}
