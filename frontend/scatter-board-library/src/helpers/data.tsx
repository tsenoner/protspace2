export interface Item {
    category : string;
    name : string;
    color?: string;
    img?: string;
}

export function truncate(str : string, n : number) {
    return (str.length > n)
        ? str.slice(0, n - 1) + '...'
        : str;
 };