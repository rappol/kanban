import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { BoardComponent } from './board/board.component';
import { DataService } from './data.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CardComponent,
        ToolbarComponent,
        BoardComponent
      ],
      providers: [
        DataService
      ],
      imports: [
        ReactiveFormsModule
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should start empty', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const cards = compiled.querySelectorAll('.card');

    expect(cards.length).toEqual(0);
  });

  it('should create a new item in the backlog', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector('#create-new');
    const input: HTMLInputElement = compiled.querySelector('#create-input');

    input.value = 'Test item';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    const backlogCards = compiled.querySelectorAll('#backlog-column .card');
    expect(backlogCards.length).toEqual(1);
    expect(backlogCards.item(0).querySelector('h3').textContent).toEqual('Test item');
  });
    
  it('should should display an item title as titlecase', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector('#create-new');
    const input: HTMLInputElement = compiled.querySelector('#create-input');

    input.value = 'test item';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    const backlogCards = compiled.querySelectorAll('#backlog-column .card');
    expect(backlogCards.length).toEqual(1);
    expect(backlogCards.item(0).querySelector('h3').textContent).toEqual('Test Item');
  });

  it('should not create a new item in the backlog if the input is empty', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector('#create-new');

    button.click();
    fixture.detectChanges();

    const backlogCards = compiled.querySelectorAll('#backlog-column .card');
    expect(backlogCards.length).toEqual(0);
  });

  it('should create multiple items in the backlog', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector('#create-new');
    const input: HTMLInputElement = compiled.querySelector('#create-input');

    input.value = 'Test item 1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    input.value = 'Test item 2';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    input.value = 'Test item 3';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    const backlogCards = compiled.querySelectorAll('#backlog-column .card');
    expect(backlogCards.length).toEqual(3);
    expect(backlogCards.item(0).querySelector('h3').textContent).toEqual('Test item 1');
    expect(backlogCards.item(1).querySelector('h3').textContent).toEqual('Test item 2');
    expect(backlogCards.item(2).querySelector('h3').textContent).toEqual('Test item 3');
  });

  it('should allow moving an item from backlog to todo', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector('#create-new');
    const input: HTMLInputElement = compiled.querySelector('#create-input');

    input.value = 'Test item';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    const backlogCards1 = compiled.querySelectorAll('#backlog-column .card');
    expect(backlogCards1.length).toEqual(1);

    const actionButtons1 = compiled.querySelector('.action-buttons');
    expect(actionButtons1).toBeFalsy();

    const card: HTMLDivElement = compiled.querySelector('#backlog-column .card');
    card.click();
    fixture.detectChanges();

    const actionButtons2: HTMLDivElement = compiled.querySelector('.action-buttons');
    expect(actionButtons2).toBeTruthy();

    const buttons = actionButtons2.querySelectorAll('button');
    expect(buttons.length).toEqual(1);
    expect(buttons.item(0).textContent).toEqual('To Do');

    buttons.item(0).click();
    fixture.detectChanges();

    const backlogCards2 = compiled.querySelectorAll('#backlog-column .card');
    expect(backlogCards2.length).toEqual(0);

    const todoCards = compiled.querySelectorAll('#todo-column .card');
    expect(todoCards.length).toEqual(1);
  });

  it('should allow moving an item from todo to doing', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector('#create-new');
    const input: HTMLInputElement = compiled.querySelector('#create-input');

    input.value = 'Test item';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    const card: HTMLDivElement = compiled.querySelector('#backlog-column .card');
    card.click();
    fixture.detectChanges();

    const actionButtons: HTMLDivElement = compiled.querySelector('.action-buttons');
    let buttons = actionButtons.querySelectorAll('button');
    buttons.item(0).click();
    fixture.detectChanges();

    let todoCards = compiled.querySelectorAll('#todo-column .card');
    expect(todoCards.length).toEqual(1);

    buttons = actionButtons.querySelectorAll('button');
    expect(buttons.length).toEqual(1);
    expect(buttons.item(0).textContent).toEqual('Doing');
    buttons.item(0).click();
    fixture.detectChanges();

    todoCards = compiled.querySelectorAll('#todo-column .card');
    expect(todoCards.length).toEqual(0);

    const doingCards = compiled.querySelectorAll('#doing-column .card');
    expect(doingCards.length).toEqual(1);
  });

  it('should allow moving an item from doing to done', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector('#create-new');
    const input: HTMLInputElement = compiled.querySelector('#create-input');

    input.value = 'Test item';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    const card: HTMLDivElement = compiled.querySelector('#backlog-column .card');
    card.click();
    fixture.detectChanges();

    let actionButtons: HTMLDivElement = compiled.querySelector('.action-buttons');
    let buttons = actionButtons.querySelectorAll('button');
    buttons.item(0).click();
    fixture.detectChanges();

    let todoCards = compiled.querySelectorAll('#todo-column .card');
    expect(todoCards.length).toEqual(1);

    buttons = actionButtons.querySelectorAll('button');
    buttons.item(0).click();
    fixture.detectChanges();

    todoCards = compiled.querySelectorAll('#todo-column .card');
    expect(todoCards.length).toEqual(0);

    let doingCards = compiled.querySelectorAll('#doing-column .card');
    expect(doingCards.length).toEqual(1);

    buttons = actionButtons.querySelectorAll('button');
    expect(buttons.length).toEqual(1);
    expect(buttons.item(0).textContent).toEqual('Done');
    buttons.item(0).click();
    fixture.detectChanges();

    doingCards = compiled.querySelectorAll('#doing-column .card');
    expect(doingCards.length).toEqual(0);

    const doneCards = compiled.querySelectorAll('#done-column .card');
    expect(doneCards.length).toEqual(1);

    actionButtons = compiled.querySelector('.action-buttons');
    if (actionButtons) {
      buttons = actionButtons.querySelectorAll('button');
      expect(buttons.length).toEqual(0);
    }
  });

  it('should allow selecting only one item at a time', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector('#create-new');
    const input: HTMLInputElement = compiled.querySelector('#create-input');

    input.value = 'Test item 1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    input.value = 'Test item 2';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    const cards: NodeListOf<HTMLDivElement> = compiled.querySelectorAll('#backlog-column .card');
    expect(cards.length).toEqual(2);

    cards.item(0).click();
    fixture.detectChanges();
    expect(cards.item(0).classList.contains('selected')).toBeTruthy();
    expect(cards.item(1).classList.contains('selected')).toBeFalsy();

    cards.item(1).click();
    fixture.detectChanges();
    expect(cards.item(0).classList.contains('selected')).toBeFalsy();
    expect(cards.item(1).classList.contains('selected')).toBeTruthy();
  });
});
