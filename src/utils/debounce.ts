function debounce(fn: Function, wait: number) {
  let timer: any = null;

  return function() {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout((...args) => {
      console.log(args);
      fn();
    }, wait);
  };
}

export default debounce;
