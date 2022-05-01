import { Salary } from "src/services/finance-api.service";

export class SalaryCalc extends Salary {
    BruttoDiffPct: number;
    NettoDiffPct: number;

    constructor(base: Salary) {
        super();
        this.akp = base.akp;
        this.arbeitgeber = base.arbeitgeber;
        this.brutto = base.brutto;
        this.netto = base.netto;
        this.kantine = base.kantine;
        this.wochenstunden = base.wochenstunden;
        this.created = base.created;
        this.modified = base.modified;
        this.monat = base.monat;
        this.jahr = base.jahr;
    }



}