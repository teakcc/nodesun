function throttle(fn: () => void, wait: number, maxWait: number) {
  let timer: any = null;
  let startTime = Date.now();

  return () => {
    const curTime = Date.now();
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
