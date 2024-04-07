export function rescusiveExcute<T = any>(arr: T[], fn: (item: T) => any) {
  return arr.map((i: any) => {
    if (i.children) {
      i.children = rescusiveExcute(i.children, fn);
    }
    return fn(i);
  });
}

export function recursiveFind(id: string, arr: any[]) {
  let result;
  arr.some((item) => {
    if (item.id === id) {
      result = item;
      return true;
    }
    if (item.children) {
      result = recursiveFind(id, item.children);
      if (result) {
        return true;
      }
    }
    return false;
  });
  return result;
}
