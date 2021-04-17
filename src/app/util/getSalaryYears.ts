import { Gehalt } from "../services/models/gehalt";
import { getUnique } from "./uniqueFromArray";

export function getDistinctYearsFromSalary(data: Array<Gehalt>): Array<number> {
    return getUnique(data.map(d => d.Jahr)).sort((n1, n2) => {
        if (n1 > n2) { return -1; }
        if (n1 < n2) { return 1; }
        return 0;
      });
}