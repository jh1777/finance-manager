import { Gehalt } from "../services/models/gehalt";
import { Distinct } from "./uniqueFromArray";

export function getDistinctYearsFromSalary(data: Array<Gehalt>): Array<number> {
    return Distinct(data.map(d => d.Jahr)).sort((n1, n2) => {
        if (n1 > n2) { return -1; }
        if (n1 < n2) { return 1; }
        return 0;
      });
}