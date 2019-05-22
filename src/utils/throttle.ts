function throttle(fn: Function, wait: number, maxWait: number) {
  let timer: any = null,
    startTime = Date.now();

  return function() {
    let curTime = Date.now();
    if (timer !== null) {
      clearTimeout(timer);
    }
    if (curTime - startTime > maxWait) {
      fn();
      startTime = curTime;
    }
    timer = setTimeout(fn, wait);
  };
}
