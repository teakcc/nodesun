function debounce(fn: () => void, wait: number) {
  let timer: any = null;

  return () => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout((...args) => {
      // console.log(args);
      fn();
    }, wait);
  };
}

export default debounce;
