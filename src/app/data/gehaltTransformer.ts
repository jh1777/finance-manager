import { Salary } from "src/services/finance-api.service";
import { Gehalt } from "../services/models/gehalt";
import { SalaryCalc } from "../services/models/salaryCalc";
import { Dictionary } from "../util/dictionary";

export class GehaltTransformer {

    /**
     * Returns "Gehalt" lists grouped by "Jahr" as the key
     * @param data Array<Gehalt>
     * @returns  Dictionary<Array<Gehalt>>
     */
    public static groupByJahr(data: Array<Salary>): Dictionary<Array<Salary>> {
        var result: Dictionary<Array<Salary>> = {};

        let years = data.map(d => d.jahr);
        let yearsUnique = years.Distinct();

        yearsUnique.forEach(y => {
            let yearData = data.filter(d => d.jahr === y);
            result[y] = yearData;
        })

        return result;
    }

    public static calculateDiffs(data: Array<Salary>): Array<SalaryCalc> {
        let calcSalary =  data.map(s => new SalaryCalc(s));
        calcSalary.forEach(d => {
            let prevYearGehalt = data.filter(d2 => d2.jahr == d.jahr - 1 && d2.monat == d.monat);
            if (prevYearGehalt && prevYearGehalt.length == 1) {
                d.BruttoDiffPct = (d.brutto * 100) / prevYearGehalt[0].brutto;
                d.NettoDiffPct = (d.netto * 100) / prevYearGehalt[0].netto;
            }
        });
        return calcSalary;
    }

    public static calculateYearDiffs(data: Array<Salary>, attribute: string): Dictionary<number> {
        var result: Dictionary<number> = {};
        let years = data.map(d => d.jahr);
        let yearsUnique = years.Distinct();

        yearsUnique.forEach(y => {
            let yearData = data.filter(d => d.jahr === y);
            let prevYearData = data.filter(d2 => d2.jahr === y - 1);

            let attrSum =  yearData.reduce((p, c) => p + c[attribute], 0);
            let yearDataCount = yearData.length;

            if (prevYearData && prevYearData.length > 0) {
                let prevYearAttrSum = prevYearData.reduce((p, c) => p + c[attribute], 0);
                let prevYearDataCount = prevYearData.length;
                let factor = yearDataCount / prevYearDataCount;

                result[y] = ((attrSum * 100) / (prevYearAttrSum * factor)) - 100;
            }
        })

        return result;
    }
}

