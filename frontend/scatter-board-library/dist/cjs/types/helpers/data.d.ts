export interface Item {
    category: string;
    name: string;
    color?: string;
    img?: string;
    id: string;
}
export declare function truncate(str: string, n: number): string;
