declare global {
    export interface Array<T> {
        SortDescending(prop: string): Array<T>;
        SortAscending(prop: string): Array<T>;
        First(): T;
        Distinct(): Array<T>;
    }
}

Array.prototype.SortDescending = function (prop: string) {
    return this.sort((n1, n2) => {
        if (n1[prop] > n2[prop]) { return -1; }
        if (n1[prop] < n2[prop]) { return 1; }
        return 0;
      });
}

Array.prototype.SortAscending = function (prop: string) {
    return this.sort((n1, n2) => {
        if (n1[prop] < n2[prop]) { return -1; }
        if (n1[prop] > n2[prop]) { return 1; }
        return 0;
      });
}

Array.prototype.Distinct = function ()  {
    return  [...new Set(this)];
}

Array.prototype.First = function () {
    if (this && this.length > 0) {
        return this[0]
    } else {
        return null;
    }
}
export { }