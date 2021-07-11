export class Gehalt {
  id: number;
  _id?: string;
  Monat: number;
  Jahr: number;
  Brutto: number;
  BruttoDiffPct: number;
  Netto: number;
  NettoDiffPct: number;
  AKP?: number;
  Kantine?: number;
  Arbeitgeber: string;
  Wochenstunden: number;

  constructor(init?: Partial<Gehalt>) {
    Object.assign(this, init);
  }
}