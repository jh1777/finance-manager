import { IName } from './interfaces/IName';

export class Ausgabe implements IName {
    Name: string;
    Betrag: number;
    Beschreibung?: string;
    Intervall: 'Monat' | 'Jahr' | 'Quartal' = 'Monat'
    Kategorie?: string;
    Tag?: string;
    _id?: string;

    Person: string;

    _modified?: Date;
    _created?: Date;
    Start?: Date;
    Ende?: Date;

    constructor(init?: Partial<Ausgabe>) {
        Object.assign(this, init);
    }
}