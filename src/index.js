import { fromEvent } from "rxjs";

const $chagePageButton = document.getElementById("ChangePage");
const changePage$ = fromEvent($chagePageButton, "click");

const dataLayer = (window.dataLayer = []);

const trackPageView = () => {
  dataLayer.push({
    event: "page_view",
    page: {
      title: `New Page ${Date.now()}`,
    },
  });
};

changePage$.subscribe(trackPageView);
