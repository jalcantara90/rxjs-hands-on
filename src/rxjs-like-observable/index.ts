interface Observer<T> {
  next: (value: T) => void;
}

interface ISubscriber<T> {
  next: (value: T) => void;
}

interface ISubscription<T> {
  unsubscribe: () => void;
}

interface IObservable<T> {
  subscribe: (observer: Observer<T>) => Subscription<T>;
}




















// Play area

const observable$ = new Observable<number>((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  setTimeout(() => {
    subscriber.next(3);
  }, 500);
});
const subscription1 = observable$.subscribe({
  next: (value) => {
    console.log('Subcribing to: ', value);
  },
});
subscription1.unsubscribe();
