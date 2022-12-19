import { TestBed, waitForAsync } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { CardComponent } from "./card/card.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { BoardComponent } from "./board/board.component";
import { DataService } from "./data.service";
import { ReactiveFormsModule } from "@angular/forms";

let nativeElement: HTMLDivElement;

const createNewTaskButton = (): HTMLButtonElement => {
  return nativeElement.querySelector("#create-new");
};

const inputTask = (): HTMLInputElement => {
  return nativeElement.querySelector("#create-input");
};

const selectCardIn = (columId: string): void => {
  const card: HTMLDivElement = nativeElement.querySelector(`#${columId} .card`);
  card.click();
};

const getAllCardsFrom = (columId: string): NodeListOf<Element> => {
  return nativeElement.querySelectorAll(`#${columId} .card`);
};

const moveTo = (action: string): void => {
  let actionButtons: HTMLDivElement = nativeElement.querySelector(".action-buttons");
  let buttons = actionButtons.querySelectorAll("button");
  let buttonNr = 0;
  switch (action) {
    case "todo":
      buttonNr = 0;
      break;
    case "doing":
      buttonNr = 1;
      break;
    case "done":
      buttonNr = 2;
      break;
    default:
      break;
  }
  buttons.item(buttonNr).click();
};

const writeTaskName = (text: string) => {   
  inputTask().value = text;
  inputTask().dispatchEvent(new Event("input"));
}

describe("AppComponent", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, CardComponent, ToolbarComponent, BoardComponent],
      providers: [DataService],
      imports: [ReactiveFormsModule],
    }).compileComponents();   
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should start empty", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const cards = compiled.querySelectorAll(".card");

    expect(cards.length).toEqual(0);
  });

  it("should create a new item in the backlog", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector("#create-new");
    const input: HTMLInputElement = compiled.querySelector("#create-input");

    input.value = "Test item";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    const backlogCards = compiled.querySelectorAll("#backlog-column .card");
    expect(backlogCards.length).toEqual(1);
    expect(backlogCards.item(0).querySelector("h3").textContent).toEqual("Test Item");
  });

  it("should should display an item title as titlecase", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector("#create-new");
    const input: HTMLInputElement = compiled.querySelector("#create-input");

    input.value = "test item";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    const backlogCards = compiled.querySelectorAll("#backlog-column .card");
    expect(backlogCards.length).toEqual(1);
    expect(backlogCards.item(0).querySelector("h3").textContent).toEqual("Test Item");
  });

  it("should not create a new item in the backlog if the input is empty", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector("#create-new");

    button.click();
    fixture.detectChanges();

    const backlogCards = compiled.querySelectorAll("#backlog-column .card");
    expect(backlogCards.length).toEqual(0);
  });

  it("should create multiple items in the backlog", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector("#create-new");
    const input: HTMLInputElement = compiled.querySelector("#create-input");

    input.value = "Test item 1";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    input.value = "Test item 2";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    input.value = "Test item 3";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    const backlogCards = compiled.querySelectorAll("#backlog-column .card");
    expect(backlogCards.length).toEqual(3);
    expect(backlogCards.item(0).querySelector("h3").textContent).toEqual("Test Item 1");
    expect(backlogCards.item(1).querySelector("h3").textContent).toEqual("Test Item 2");
    expect(backlogCards.item(2).querySelector("h3").textContent).toEqual("Test Item 3");
  });

  it("should allow moving an item from backlog to todo", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
    let columnCards: NodeListOf<Element>;

    writeTaskName("Test item");    
    fixture.detectChanges();
    createNewTaskButton().click();
    fixture.detectChanges();

    selectCardIn("backlog-column");
    fixture.detectChanges();

    moveTo("todo");
    fixture.detectChanges();

    columnCards = getAllCardsFrom("backlog-column");
    expect(columnCards.length).toEqual(0);
    columnCards = getAllCardsFrom("todo-column");
    expect(columnCards.length).toEqual(1);
  });

  it("should allow moving an item from todo to doing", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
    let columnCards: NodeListOf<Element>;

    writeTaskName("Test item");    
    fixture.detectChanges();
    createNewTaskButton().click();
    fixture.detectChanges();

    selectCardIn("backlog-column");
    fixture.detectChanges();

    moveTo("todo");
    fixture.detectChanges();

    columnCards = getAllCardsFrom("backlog-column");
    expect(columnCards.length).toEqual(0);
    columnCards = getAllCardsFrom("todo-column");
    expect(columnCards.length).toEqual(1);

    selectCardIn("todo-column");
    fixture.detectChanges();

    moveTo("doing");
    fixture.detectChanges();

    columnCards = getAllCardsFrom("todo-column");
    expect(columnCards.length).toEqual(0);
    columnCards = getAllCardsFrom("doing-column");
    expect(columnCards.length).toEqual(1);
  });

  it("should allow moving an item from doing to done", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
    let columnCards: NodeListOf<Element>;

    inputTask().value = "Test item";
    inputTask().dispatchEvent(new Event("input"));
    fixture.detectChanges();
    createNewTaskButton().click();
    fixture.detectChanges();

    selectCardIn("backlog-column");
    fixture.detectChanges();

    moveTo("todo");
    fixture.detectChanges();

    columnCards = getAllCardsFrom("todo-column");
    expect(columnCards.length).toEqual(1);

    selectCardIn("todo-column");
    fixture.detectChanges();

    moveTo("doing");
    fixture.detectChanges();

    columnCards = getAllCardsFrom("todo-column");
    expect(columnCards.length).toEqual(0);

    columnCards = getAllCardsFrom("doing-column");
    expect(columnCards.length).toEqual(1);

    selectCardIn("doing-column");
    fixture.detectChanges();

    moveTo("done");
    fixture.detectChanges();

    columnCards = getAllCardsFrom("doing-column");
    expect(columnCards.length).toEqual(0);

    columnCards = getAllCardsFrom("done-column");
    expect(columnCards.length).toEqual(1);
  });

  it("should allow selecting multiple items at a time", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
    const button: HTMLButtonElement = compiled.querySelector("#create-new");
    const input: HTMLInputElement = compiled.querySelector("#create-input");

    input.value = "Test item 1";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    input.value = "Test item 2";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    const cards: NodeListOf<HTMLDivElement> = compiled.querySelectorAll("#backlog-column .card");
    expect(cards.length).toEqual(2);

    cards.item(0).click();
    fixture.detectChanges();
    expect(cards.item(0).classList.contains("selected")).toBeTruthy();
    expect(cards.item(1).classList.contains("selected")).toBeFalsy();

    cards.item(1).click();
    fixture.detectChanges();
    expect(cards.item(0).classList.contains("selected")).toBeTruthy();
    expect(cards.item(1).classList.contains("selected")).toBeTruthy();
  });
});
