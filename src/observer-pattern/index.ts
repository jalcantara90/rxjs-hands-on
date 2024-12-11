interface IObserver<T> {
  update: (value: T) => void;
}

interface ISubject<T> {
  attach: (observer: IObserver<T>) => Subscription;
  dettach: (observer: IObserver<T>) => void;
  notify: (value: T) => void;
}

interface ISubscription {
  unsubscribe: () => void;
}

class Subscription implements ISubscription {
  private teardown: () => void;

  constructor(teardown: (() => void)) {
    this.teardown = teardown;
  }

  unsubscribe() {
    this.teardown();
  }
}

class Subject<T = unknown> implements ISubject<T> {
  private observers: IObserver<T>[] = [];

  attach(observer: IObserver<T>) {
    this.observers.push(observer);
    return new Subscription(() => {
      this.dettach(observer);
    });
  }
  dettach(observer: IObserver<T>) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }
  notify(value: T) {
    this.observers.forEach((observer) => {
      observer.update(value);
    });
  }
}

const observer1: IObserver<string> = {
  update: function (value: string): void {
    console.log('Observer1', value);
  },
};

const observer2: IObserver<string> = {
  update: function (value: string): void {
    console.log('Observer2', value);
  },
};

const subject = new Subject<string>();

const subscription1 = subject.attach({
  update: function (value: string): void {
    console.log('Observer1', value);
  },
});

subject.notify('First value');

const subscription2 = subject.attach({
  update: function (value: string): void {
    console.log('Observer2', value);
  },
});

subject.notify('Second value');

subscription1.unsubscribe();

subject.notify('Third value');

subscription2.unsubscribe();

subject.notify('Last value');
