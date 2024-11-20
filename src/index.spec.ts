import { firstValueFrom, from, lastValueFrom, throttleTime } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

describe('RxJS', () => {
  it('example using marble', () => {
    testScheduler.run((helpers) => {
      const { cold, time, expectObservable, expectSubscriptions } = helpers;

      const e1 = cold(' -a--b--c---|');
      const e1subs = '  ^----------!';
      const t = time('   ---|      ');
      const expected = '-a-----c---|';

      expectObservable(e1.pipe(throttleTime(t))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(e1subs);
    });
  });

  it('resolve observable', async () => {

    const firstValue = await firstValueFrom(from([1, 2]));
    const lastValue = await lastValueFrom(from([1, 2]));

    expect(firstValue).toEqual(1);
    expect(lastValue).toEqual(2);
  });
});
