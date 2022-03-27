import { fromEvent } from "rxjs";

const $addToCart = document.getElementById("AddToCart");
const $chagePageButton = document.getElementById("ChangePage");

const addToCart$ = fromEvent($addToCart, "click");
const changePage$ = fromEvent($chagePageButton, "click");

const dataLayer = (window.dataLayer = []);

Object.defineProperty(dataLayer, "push", {
  value() {
    Array.prototype.push.apply(this, arguments);
    console.log(this[this.length - 1]);
  },
});

const trackAddToCart = () => {
  dataLayer.push({
    event: "add_to_cart",
    product: {
      product_id: `${Math.round(Math.random() * 1000)}`,
    },
  });
};

const trackPageView = () => {
  dataLayer.push({
    event: "page_view",
    page: {
      title: `New Page ${Date.now()}`,
    },
  });
};

addToCart$.subscribe(trackAddToCart);
changePage$.subscribe(trackPageView);
