import { Gehalt } from "../services/models/gehalt";
import { Dictionary } from "../util/dictionary";
import { getUnique } from "../util/uniqueFromArray";

export class GehaltTransformator {

    /**
     * Returns "Gehalt" lists grouped by "Jahr" as the key
     * @param data Array<Gehalt>
     * @returns  Dictionary<Array<Gehalt>>
     */
    public static groupByJahr(data: Array<Gehalt>): Dictionary<Array<Gehalt>> {
        var result: Dictionary<Array<Gehalt>> = {};

        let years = data.map(d => d.Jahr);
        let yearsUnique = getUnique<number>(years);

        yearsUnique.forEach(y => {
            let yearData = data.filter(d => d.Jahr === y);
            result[y] = yearData;
        })

        return result;
    }
}