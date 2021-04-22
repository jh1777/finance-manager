export function Distinct<T>(list: Array<T>): Array<T>  {

    return  [...new Set(list)];
}