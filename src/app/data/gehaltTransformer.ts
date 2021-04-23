import { Gehalt } from "../services/models/gehalt";
import { Dictionary } from "../util/dictionary";

export class GehaltTransformer {

    /**
     * Returns "Gehalt" lists grouped by "Jahr" as the key
     * @param data Array<Gehalt>
     * @returns  Dictionary<Array<Gehalt>>
     */
    public static groupByJahr(data: Array<Gehalt>): Dictionary<Array<Gehalt>> {
        var result: Dictionary<Array<Gehalt>> = {};

        let years = data.map(d => d.Jahr);
        let yearsUnique = years.Distinct();

        yearsUnique.forEach(y => {
            let yearData = data.filter(d => d.Jahr === y);
            result[y] = yearData;
        })

        return result;
    }

    public static calculateDiffs(data: Array<Gehalt>): Array<Gehalt> {
        data.forEach(d => {
            let prevYearGehalt = data.filter(d2 => d2.Jahr == d.Jahr - 1 && d2.Monat == d.Monat);
            if (prevYearGehalt && prevYearGehalt.length == 1) {
                d.BruttoDiffPct = (d.Brutto * 100) / prevYearGehalt[0].Brutto;
                d.NettoDiffPct = (d.Netto * 100) / prevYearGehalt[0].Netto;
            }
        });
        return data;
    }

    public static calculateYearDiffs(data: Array<Gehalt>, attribute: string): Dictionary<number> {
        var result: Dictionary<number> = {};
        let years = data.map(d => d.Jahr);
        let yearsUnique = years.Distinct();

        yearsUnique.forEach(y => {
            let yearData = data.filter(d => d.Jahr === y);
            let prevYearData = data.filter(d2 => d2.Jahr === y - 1);

            let attrSum =  yearData.reduce((p, c) => p + c[attribute], 0);
            let yearDataCount = yearData.length;

            if (prevYearData && prevYearData.length > 0) {
                let prevYearAttrSum = prevYearData.reduce((p, c) => p + c[attribute], 0);
                let prevYearDataCount = prevYearData.length;
                let factor = yearDataCount / prevYearDataCount;

                result[y] = ((attrSum * 100) / (prevYearAttrSum * factor)) - 100;
            } else {
                console.error(`No previous year data found: ${y - 1}`);
            }
        })

        return result;
    }
}

