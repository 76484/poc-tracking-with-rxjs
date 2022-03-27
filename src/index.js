import { fromEvent, interval, of, merge, NEVER } from "rxjs";
import {
  delay,
  map,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs/operators";

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

changePage$.pipe(tap(() => console.log("got page change"))).subscribe();

// assume page data loads 2 second after page changed
const pageDataLoaded$ = changePage$.pipe(
  tap(() => console.log("wait for page data to load")),
  delay(2000),
  tap(() => console.log("page data loaded")),
  map(() => ({
    title: `New Page ${Date.now()}`,
  })),
  tap((pageData) => console.log(pageData))
);

const searchDataLoaded$ = interval(500).pipe(
  map((count) => ({
    event: "product_search",
    count,
    products: [
      { product_id: `${Math.round(Math.random() * 1000)}` },
      { product_id: `${Math.round(Math.random() * 1000)}` },
    ],
    search: {
      term: "foo",
    },
  })),
  startWith(null)
);

const otherDataLoaded$ = of({
  foo: "bar",
});

// page changes => new subcription
// gather all load calls
// when page data loaded is received => finish
const gatherLoads$ = merge(changePage$.pipe(map(() => null)), pageDataLoaded$)
  .pipe(
    switchMap((pageData) => {
      const isGathering = pageData === null;
      return isGathering ? NEVER : of(pageData);
    }),
    withLatestFrom(searchDataLoaded$, otherDataLoaded$)
  )
  .subscribe((entries) => {
    console.log("TIME TO COMMIT");
    console.log(entries);
  });
