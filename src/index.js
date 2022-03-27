import { fromEvent, interval, Observable } from "rxjs";
import { delay, map } from "rxjs/operators";

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

const searchDataLoaded$ = interval(3000)
  .pipe(
    map(() => ({
      event: "product_search",
      products: [
        { product_id: `${Math.round(Math.random() * 1000)}` },
        { product_id: `${Math.round(Math.random() * 1000)}` },
      ],
      search: {
        term: "foo",
      },
    }))
  )
  .subscribe((x) => console.log(x));

addToCart$.subscribe(trackAddToCart);

// change page starts a new "transaction"

const pageDataLoaded$ = new Observable((subscriber) => {
  subscriber.next({
    title: `New Page ${Date.now()}`,
  });
});

// assume page data loads 2 second after page changed
changePage$.subscribe((_) => {
  console.log("page changed");
  pageDataLoaded$
    .pipe(delay(2000))
    .subscribe((pageData) => console.log(pageData));
});
