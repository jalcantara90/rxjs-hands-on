interface IObserver<T> {
  update: (value: T) => void;
}

interface ISubject<T> {
  attach: (observer: IObserver<T>) => void;
  dettach: (observer: IObserver<T>) => void;
  notify: (value: T) => void;
}















// Play area
const observer1 = {
  update: function (value: string): void {
    console.log('Observer1', value);
  },
};

subject.attach(observer1);
subject.notify('First value');

const observer2 = {
  update: function (value: string): void {
    console.log('Observer2', value);
  },
};

subject.attach(observer2);
subject.notify('Second value');
subject.dettach(observer1);
subject.notify('Third value');
subject.dettach(observer2);
subject.notify('Last value');
