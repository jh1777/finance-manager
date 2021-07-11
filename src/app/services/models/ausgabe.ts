import { IName } from './interfaces/IName';

export class Ausgabe implements IName {
    Name: string;
    Betrag: number;
    Beschreibung?: string;
    Intervall: 'Monat' | 'Jahr' | 'Quartal' = 'Monat'
    Kategorie?: string;
    Tag?: string;
    id?: number;
    _id?: string;
    Start: string;
    Ende: string;
    Erstellt: string;
    Bearbeitet: string;
    Person: string;

    _created?: string;
    _modified?: string;

    constructor(init?: Partial<Ausgabe>) {
        Object.assign(this, init);
    }
}