import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { CardComponent } from "./card/card.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { BoardComponent } from "./board/board.component";
import { DataService } from "./services/data.service";
import { ReactiveFormsModule } from "@angular/forms";

let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;

const createNewTaskButton = (): void => {
  fixture.debugElement.nativeElement.querySelector("#create-new").click();
  fixture.detectChanges();
};

const selectCardIn = (columId: string, index: number = 0): void => {
  const card: NodeListOf<HTMLDivElement> = fixture.debugElement.nativeElement.querySelectorAll(`#${columId} .card`);
  card.item(index).click();
  fixture.detectChanges();
};

const getAllCardsFrom = (columId: string): NodeListOf<Element> => {
  return fixture.debugElement.nativeElement.querySelectorAll(`#${columId} .card`);
};

const moveTo = (action: string): void => {
  let actionButtons: HTMLDivElement = fixture.debugElement.nativeElement.querySelector(".action-buttons");
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
  fixture.detectChanges();
};

const writeTaskName = (text: string) => {
  const inputTask = fixture.debugElement.nativeElement.querySelector("#create-input");
  inputTask.value = text;
  inputTask.dispatchEvent(new Event("input"));
  fixture.detectChanges();
};

describe("AppComponent", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, CardComponent, ToolbarComponent, BoardComponent],
      providers: [DataService],
      imports: [ReactiveFormsModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
      });
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  describe("Layout", () => {
    it("should start empty without any card", () => {
      const compiled: HTMLDivElement = fixture.debugElement.nativeElement;
      const cards = compiled.querySelectorAll(".card");

      expect(cards.length).toEqual(0);
    });

    it("should display an item title as titlecase", () => {
      writeTaskName("test item");
      createNewTaskButton();

      const backlogCards = getAllCardsFrom("backlog-column");
      expect(backlogCards.length).toEqual(1);
      expect(backlogCards.item(0).querySelector("h3").textContent).toEqual("Test Item");
    });
  });

  describe("Create button", () => {
    it("should create a new item in the backlog when input has value", () => {
      writeTaskName("Test item");
      createNewTaskButton();

      const backlogCards = getAllCardsFrom("backlog-column");
      expect(backlogCards.length).toEqual(1);
      expect(backlogCards.item(0).querySelector("h3").textContent).toEqual("Test Item");
    });

    it("should not create a new item in the backlog when input is empty", () => {
      createNewTaskButton();

      const backlogCards = getAllCardsFrom("backlog-column");
      expect(backlogCards.length).toEqual(0);
    });

    it("should allow create multiple items in the backlog", () => {
      writeTaskName("test item 1");
      createNewTaskButton();

      writeTaskName("test item 2");
      createNewTaskButton();

      writeTaskName("test item 3");
      createNewTaskButton();

      const backlogCards = getAllCardsFrom("backlog-column");
      expect(backlogCards.length).toEqual(3);
      expect(backlogCards.item(0).querySelector("h3").textContent).toEqual("Test Item 1");
      expect(backlogCards.item(1).querySelector("h3").textContent).toEqual("Test Item 2");
      expect(backlogCards.item(2).querySelector("h3").textContent).toEqual("Test Item 3");
    });
  });

  describe("Moving buttons", () => {
    describe("From backlog", () => {
      it("should allow moving an item from backlog to todo", () => {
        let columnCards: NodeListOf<Element>;

        writeTaskName("Test item");
        createNewTaskButton();
        selectCardIn("backlog-column");
        moveTo("todo");

        columnCards = getAllCardsFrom("backlog-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(1);
      });
      it("should allow moving an item from backlog to doing", () => {
        let columnCards: NodeListOf<Element>;

        writeTaskName("Test item");
        createNewTaskButton();
        selectCardIn("backlog-column");
        moveTo("doing");

        columnCards = getAllCardsFrom("backlog-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("doing-column");
        expect(columnCards.length).toEqual(1);
      });
      it("should allow moving an item from backlog to done", () => {
        let columnCards: NodeListOf<Element>;

        writeTaskName("Test item");
        createNewTaskButton();
        selectCardIn("backlog-column");
        moveTo("done");

        columnCards = getAllCardsFrom("backlog-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("done-column");
        expect(columnCards.length).toEqual(1);
      });
    });
    describe("From todo", () => {
      it("should allow moving an item from todo to doing", () => {
        let columnCards: NodeListOf<Element>;

        writeTaskName("Test item");
        createNewTaskButton();
        selectCardIn("backlog-column");
        moveTo("todo");

        columnCards = getAllCardsFrom("backlog-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(1);

        selectCardIn("todo-column");
        moveTo("doing");

        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("doing-column");
        expect(columnCards.length).toEqual(1);
      });
      it("should allow moving an item from todo to done", () => {
        let columnCards: NodeListOf<Element>;

        writeTaskName("Test item");
        createNewTaskButton();
        selectCardIn("backlog-column");
        moveTo("todo");

        columnCards = getAllCardsFrom("backlog-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(1);

        selectCardIn("todo-column");
        moveTo("done");

        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("done-column");
        expect(columnCards.length).toEqual(1);
      });
    });
    describe("From doing", () => {
      it("should allow moving an item from doing to done", () => {
        let columnCards: NodeListOf<Element>;

        writeTaskName("Test item");
        createNewTaskButton();
        selectCardIn("backlog-column");
        moveTo("todo");

        columnCards = getAllCardsFrom("backlog-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(1);

        selectCardIn("todo-column");
        moveTo("doing");

        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("doing-column");
        expect(columnCards.length).toEqual(1);

        selectCardIn("doing-column");
        moveTo("done");

        columnCards = getAllCardsFrom("doing-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("done-column");
        expect(columnCards.length).toEqual(1);
      });
      it("should allow moving an item from doing to todo", () => {
        let columnCards: NodeListOf<Element>;

        writeTaskName("Test item");
        createNewTaskButton();
        selectCardIn("backlog-column");
        moveTo("todo");

        columnCards = getAllCardsFrom("backlog-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(1);

        selectCardIn("todo-column");
        moveTo("doing");

        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("doing-column");
        expect(columnCards.length).toEqual(1);

        selectCardIn("doing-column");
        moveTo("todo");

        columnCards = getAllCardsFrom("doing-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(1);
      });
    });
    describe("From done", () => {
      it("should allow moving an item from done to doing", () => {
        let columnCards: NodeListOf<Element>;

        writeTaskName("Test item");
        createNewTaskButton();
        selectCardIn("backlog-column");
        moveTo("todo");

        columnCards = getAllCardsFrom("backlog-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(1);

        selectCardIn("todo-column");
        moveTo("doing");

        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("doing-column");
        expect(columnCards.length).toEqual(1);

        selectCardIn("doing-column");
        moveTo("done");

        columnCards = getAllCardsFrom("doing-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("done-column");
        expect(columnCards.length).toEqual(1);

        selectCardIn("done-column");
        moveTo("doing");

        columnCards = getAllCardsFrom("doing-column");
        expect(columnCards.length).toEqual(1);
        columnCards = getAllCardsFrom("done-column");
        expect(columnCards.length).toEqual(0);
      });
      it("should allow moving an item from done to todo", () => {
        let columnCards: NodeListOf<Element>;

        writeTaskName("Test item");
        createNewTaskButton();
        selectCardIn("backlog-column");
        moveTo("todo");

        columnCards = getAllCardsFrom("backlog-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(1);

        selectCardIn("todo-column");
        moveTo("doing");

        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("doing-column");
        expect(columnCards.length).toEqual(1);

        selectCardIn("doing-column");
        moveTo("done");

        columnCards = getAllCardsFrom("doing-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("done-column");
        expect(columnCards.length).toEqual(1);

        selectCardIn("done-column");
        moveTo("doing");

        columnCards = getAllCardsFrom("doing-column");
        expect(columnCards.length).toEqual(1);
        columnCards = getAllCardsFrom("done-column");
        expect(columnCards.length).toEqual(0);
      });
    });
    describe("Multiple/Single Items", () => {
      it("should allow moving multiple items between columns", () => {
        let columnCards: NodeListOf<Element>;

        writeTaskName("Test item 1");
        createNewTaskButton();
        writeTaskName("Test item 2");
        createNewTaskButton();
        selectCardIn("backlog-column", 0);
        selectCardIn("backlog-column", 1);

        columnCards = getAllCardsFrom("backlog-column");
        expect(columnCards.item(0).classList.contains("selected")).toBeTruthy();
        expect(columnCards.item(1).classList.contains("selected")).toBeTruthy();

        moveTo("todo");

        columnCards = getAllCardsFrom("backlog-column");
        expect(columnCards.length).toEqual(0);
        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(2);
      });
      it("should only move the selected items between columns", () => {
        let columnCards: NodeListOf<Element>;

        writeTaskName("Test item 1");
        createNewTaskButton();
        writeTaskName("Test item 2");
        createNewTaskButton();
        selectCardIn("backlog-column", 1);

        columnCards = getAllCardsFrom("backlog-column");
        expect(columnCards.item(0).classList.contains("selected")).toBeFalsy();
        expect(columnCards.item(1).classList.contains("selected")).toBeTruthy();

        moveTo("todo");

        columnCards = getAllCardsFrom("backlog-column");
        expect(columnCards.length).toEqual(1);
        columnCards = getAllCardsFrom("todo-column");
        expect(columnCards.length).toEqual(1);
      });
    });
  });

  describe("Selection", () => {
    it("should allow selecting multiple items at a time", () => {
      let columnCards: NodeListOf<Element>;

      writeTaskName("test item 1");
      createNewTaskButton();

      writeTaskName("test item 2");
      createNewTaskButton();

      columnCards = getAllCardsFrom("backlog-column");
      expect(columnCards.length).toEqual(2);

      selectCardIn("backlog-column", 0);
      expect(columnCards.item(0).classList.contains("selected")).toBeTruthy();
      expect(columnCards.item(1).classList.contains("selected")).toBeFalsy();

      selectCardIn("backlog-column", 1);
      expect(columnCards.item(0).classList.contains("selected")).toBeTruthy();
      expect(columnCards.item(1).classList.contains("selected")).toBeTruthy();
    });

    it("should allow deselecting an item after is selected", () => {
      let columnCards: NodeListOf<Element>;

      writeTaskName("test item 1");
      createNewTaskButton();

      columnCards = getAllCardsFrom("backlog-column");
      expect(columnCards.length).toEqual(1);

      selectCardIn("backlog-column", 0);
      expect(columnCards.item(0).classList.contains("selected")).toBeTruthy();
      selectCardIn("backlog-column", 0);
      expect(columnCards.item(0).classList.contains("selected")).toBeFalsy();
    });
  });
});
