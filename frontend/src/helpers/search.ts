export function GroupBy<T, K extends keyof T>(array: T[], key: K) {
    let map = new Map<T[K], T[]>();
    array.forEach(item => {
       let itemKey = item[key];
       if (!map.has(itemKey)) {
          map.set(itemKey, array.filter(i => i[key] === item[key]));
       }
    });
    return map;
 }

export function truncate(str : string, n : number) {
   return (str.length > n)
       ? str.slice(0, n - 1) + '...'
       : str;
};