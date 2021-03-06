declare global {
    export interface Array<T> {
        SortDescending(prop: string | number): Array<T>;
        SortAscending(prop: string| number): Array<T>;
        First(): T;
        Distinct(): Array<T>;
    }
}

Array.prototype.SortDescending = function (prop: string | number) {
    return this.sort((n1, n2) => {
        if (n1[prop] > n2[prop]) { return -1; }
        if (n1[prop] < n2[prop]) { return 1; }
        return 0;
      });
}

Array.prototype.SortAscending = function (prop: string| number) {
    return this.sort((n1, n2) => {
        if (n1[prop] < n2[prop]) { return -1; }
        if (n1[prop] > n2[prop]) { return 1; }
        return 0;
      });
}

Array.prototype.Distinct = function ()  {
    //return  [...new Set(this)];
    return this.filter((value, index, self) => self.indexOf(value) === index);
}

Array.prototype.First = function () {
    if (this && this.length > 0) {
        return this[0]
    } else {
        return null;
    }
}
export { }