export function getNYears(noOfYears: number): Array<number> {
    let result = new Array<number>();
    let currentYear = new Date().getFullYear();

    for (let index = 0; index < noOfYears; index++) {
        result.push(currentYear - index);
    }
    
    return result;
}