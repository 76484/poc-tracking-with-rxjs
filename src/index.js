import { fromEvent, interval, of, merge, NEVER } from "rxjs";
import { delay, map, switchMap, tap } from "rxjs/operators";

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
  }))
);

// TODO: what if no search data gets loaded?
// TODO: emit multiple times
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
  }))
);

// page changes => new subcription
// gather all load calls
// when page data loaded is received => finish
// TODO: We need to wait for pageDataLoaded$
// and take last value from searchDataLoaded$ ONLY IF it has one

const gatherLoads$ = merge(
  changePage$.pipe(map(() => true)),
  pageDataLoaded$.pipe(map(() => false))
)
  .pipe(
    switchMap((isGathering) => {
      console.log(`isGathering: ${isGathering}`);
      return isGathering ? NEVER : of(isGathering);
    })
  )
  .subscribe(() => console.log("TIME TO COMMIT"));
