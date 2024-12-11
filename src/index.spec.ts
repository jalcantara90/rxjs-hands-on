
import { map, Observable, Subject } from ".";

describe('Example', () => {
  // it('should', () => {
  //   const subject$ = new Observable<{ text: string }>();

  //   const subscription1 = subject$
  //     .pipe((val) => ({ text: `${val.text} modified` }))
  //     .subscribe({
  //       next: (value) => {
  //         console.log('Display text:', value.text);
  //       },
  //     });

  //   subject$.next({ text: 'This text is just received for first subscriber' });

  //   const subscription2 = subject$.subscribe({
  //     next: (value) => {
  //       console.log('Second text subscription:', value.text);
  //     },
  //   });

  //   subject$.next({ text: 'Text for both subscribers' });
  //   subscription1.unsubscribe();
  //   subject$.next({ text: 'Text just for second subscriber' });
  //   subscription2.unsubscribe();
  //   subject$.next({ text: 'No subscribers' });

  //   expect(true).toBeTruthy();
  // });
  it('should', () => {
    const observable = new Observable<string>(subscriber => {
      subscriber.next('Hola');
      subscriber.next('Mundo')
    });

    observable.pipe(
      map((val) => ({ myVal: val }))
    ).subscribe({
      next: (val) => console.log(val)
    });

    const subject$ = new Subject();

    const subscription1 = subject$.pipe(
      map((val) => ({ subject: val }))
    ).subscribe({
      next: (val) => console.log('Subject', val)
    });
    
    subject$.next('For first subscriber')
    const subscription2 = subject$.subscribe({
      next: (val) => console.log('Subject', val)
    });

    subject$.next('For Both subscribers');

    subscription1.unsubscribe();
    subject$.next('Just for second subscriber');

    subscription2.unsubscribe();

    subject$.next('No subscriber');

    expect(true).toBeTruthy();
  });
});
