export function getUnique<T>(list: Array<T>): Array<T>  {

    return  [...new Set(list)];
}