import { fromEvent } from "rxjs";

const $chagePageButton = document.getElementById("ChangePage");
const changePage$ = fromEvent($chagePageButton, "click");

changePage$.subscribe((_event) => console.log("change page now"));
