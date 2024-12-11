import { OperatorFunction } from 'rxjs';
interface Observer<T> {
  next: (value: T) => void;
}

interface ISubscriber<T> {
  next: (value: T) => void;
}

interface ISubscription<T> {
  unsubscribe: () => void;
}

export interface UnaryFunction<T, R> {
  (source: T): R;
}



interface Operator<T = any, U = any> {
  (value: T): U;
}

export interface OperatorFunction<T, R>
  extends Operator<Observable<T>, Observable<R>> {}

interface IObservable<T> {
  subscribe: (observer: Observer<T>) => Subscription<T>;
  pipe: (...operators: Operator[]) => IObservable<T>;
}

class Subscription<T> implements ISubscription<T> {
  protected isClosed: boolean;
  private teardown: () => void;

  constructor(teardown?: () => void) {
    this.isClosed = false;
    this.teardown = teardown ?? (() => null);
  }

  unsubscribe() {
    if (!this.isClosed) {
      this.isClosed = true;
      this.teardown();
    }
  }
}

class Subscriber<T> extends Subscription<T> implements ISubscriber<T> {
  private observer: Observer<T>;

  constructor(observer: Observer<T>) {
    super();
    this.observer = observer;
  }

  next(value: T) {
    if (!this.isClosed) {
      this.observer.next(value);
    }
  }
}

class Observable<T> implements IObservable<T> {
  private subscriber: (subscriber: ISubscriber<T>) => void = () => null;

  constructor(subscribe?: (subscriber: ISubscriber<T>) => void) {
    if (subscribe) {
      this.subscriber = subscribe;
    }
  }

  subscribe(observer: Observer<T>): Subscription<T> {
    const subscriber = new Subscriber(observer);
    this.subscriber(subscriber);
    return subscriber;
  }

  pipe(...operators: Operator[]) {
    return operators.reduce((source, operator) => operator(source), this);
  }
}

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

interface ISubject<T> {
  next: (value: T) => void;
  subscribe: (observer: Observer<T>) => ISubscription<T>;
  removeObserver: (observer: Observer<T>) => void;
}

class Subject<T> extends Observable<T> implements Observer<T>, ISubject<T> {
  private observers: Observer<T>[];
  private isClosed: Boolean;

  constructor() {
    super();
    this.observers = [];
    this.isClosed = false;
  }

  next(value: T): void {
    if (!this.isClosed) {
      this.observers.forEach((observer) => observer.next(value));
    }
  }

  override subscribe(observer: Observer<T>): Subscription<T> {
    this.observers.push(observer);
    return new Subscription(() => {
      this.removeObserver(observer);
    });
  }

  removeObserver(observer: Observer<T>) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }
}

type MapOperator<T, U> = (
  project: <T>(value: T) => U
) => (sourceObservable$: Observable<T>) => Observable<U>;

type FilterOperator<T> = (
  predicate: <T>(value: T) => T
) => (sourceObservable$: Observable<T>) => Observable<T>;

function map<T, U>(
  project: <T>(value: T) => U
): (sourceObservable$: Observable<T>) => Observable<U> {
  return function (sourceObservable$: Observable<T>) {
    return new Observable((subscriber) => {
      sourceObservable$.subscribe({
        next: (value) => subscriber.next(project(value)),
      });
    });
  };
}

function filter<T>(
  predicate: <U = T>(value: U) => boolean
): (sourceObservable$: Observable<T>) => Observable<T> {
  return function (sourceObservable$: Observable<T>) {
    return new Observable((subscriber) => {
      sourceObservable$.subscribe({
        next: (value) => {
          if (predicate(value)) {
            subscriber.next(value);
          }
        },
      });
    });
  };
}

const subject$$ = new Subject<string>();

const subscription3 = subject$$.subscribe({
  next: (val) => {
    console.log('First observer', val);
  },
});

subject$$.next('Hello');

const subscription4 = subject$$.subscribe({
  next: (val) => {
    console.log('Second observer', val);
  },
});

subject$$.next('World');

subscription3.unsubscribe();

subject$$.next('RxJs is');

subscription4.unsubscribe();
subject$$.next('Easy');
