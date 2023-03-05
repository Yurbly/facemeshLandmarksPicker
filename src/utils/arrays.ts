export const arraysHaveSameItems = (arr1: Array<unknown>, arr2: Array<unknown>) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  
  arr1.sort();
  arr2.sort();
  
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  
  return true;
}