interface Observer<T> {
  next: (value: T) => void;
}

type Operator<T = any, U = any> = (value: T) => U;

class Subscription {
  protected closed: boolean;
  private teardown: (() => void) | null;

  constructor(teardown: (() => void) | null = null) {
    this.closed = false;
    this.teardown = teardown;
  }

  unsubscribe(): void {
    if (!this.closed) {
      this.closed = true;
      if (this.teardown) {
        this.teardown();
      }
    }
  }
}

class Subscriber<T> extends Subscription {
  private observer: Observer<T>;
  constructor(observer: Observer<T>) {
    super();
    this.observer = observer;
  }

  next(value: T): void {
    if (!this.closed && this.observer.next) {
      this.observer.next(value);
    }
  }
}

export class Observable<T> {
  private _subscribe: (subscriber: Subscriber<T>) => void = () => null;

  constructor(subscribe?: (subscriber: Subscriber<T>) => void) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }

  subscribe(observer: Observer<T>): Subscription {
    const subscriber = new Subscriber(observer);
    this._subscribe(subscriber);
    return subscriber;
  }

  public pipe(...operators: Operator[]): Observable<T> {
    return operators.reduce((source, operator) => operator(source), this);
  }
}

export function map<T = any, U = any>(mapFunction: (value: T) => U) {
  return function (inputObservable: Observable<any>) {
    return new Observable<U>((observer: Observer<U>) => {
      inputObservable.subscribe({
        next: (value) => observer.next(mapFunction(value)),
      });
    });
  };
}

export class Subject<T> extends Observable<T> implements Observer<T> {
  private observers: Observer<T>[] = [];
  private isStopped = false;

  constructor() {
    super();
  }

  next(value: T): void {
    if (!this.isStopped) {
      this.observers.forEach((observer) => observer.next?.(value));
    }
  }

  override subscribe(observer: Observer<T>): Subscription {
    this.observers.push(observer);
    return new Subscription(() => {
      this.removeObserver(observer);
    });
  }

  removeObserver(observer: Observer<T>): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }
}


export class Subscription<T = any> {
  private observable: Observable<T>;
  private observer: Observer<T>;

  constructor(observable: Observable<T>, observer: Observer<T>) {
    this.observable = observable;
    this.observer = observer;
  }

  unsubscribe(): void {
    this.observable.unsubscribe(this.observer);
  }
}

// interface Observer<T> {
//   next: (value: T) => void;
// }


// export class Observable<T> {
//   private observers: Observer<T>[] = [];

//   public subscribe(observer: Observer<T>): Subscription<T> {
//     this.observers.push(observer);
//     return new Subscription(this, observer);
//   }

//   public unsubscribe(observer: Observer<T>): void {
//     this.observers = this.observers.filter((obs) => obs !== observer);
//   }

//   public next(value: T): void {
//     this.observers.forEach((observer) => observer.next(value));
//   }
// }

// const observable$ = new Observable();

// const subscription1 = observable$.subscribe({
//   next: (val) => console.log('Subscription 1', val),
// });

// observable$.next('For first subscriber');
// const subscription2 = observable$.subscribe({
//   next: (val) => console.log('Subscription 2', val),
// });

// observable$.next('For Both subscribers');

// subscription1.unsubscribe();
// observable$.next('Just for second subscriber');

// subscription2.unsubscribe();



// observable$.next('No subscriber');





// const subject$ = new Subject<string>();
// const observer1 = {
//   update: (val: string) => console.log('FirstSubscriber', val),
// };
// const observer2 = {
//   update: (val: string) => console.log('SecondSubscriber', val),
// };

// subject$.attach(observer1);
// subject$.notify('First');

// subject$.attach(observer2);
// subject$.notify('Second');
// subject$.dettach(observer1);
// subject$.notify('Third');
