export class Observable<T> {
  private readonly observers: Set<TObserver<T>> = new Set();

  subscribe(func: TObserver<T>) {
    this.observers.add(func);
  }

  unsubscribe(func: TObserver<T>) {
    this.observers.delete(func);
  }

  notify(data: T) {
    this.observers.forEach(observer => observer(data));
  }

  unsubscribeAll() {
    this.observers.clear();
  }
}
