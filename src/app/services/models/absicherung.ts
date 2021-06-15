import { IName } from './interfaces/IName';

export class Absicherung implements IName {
    Name: string;
    id?: number;
    Erstellt: string;
    Bearbeitet: string;
    Person: string;
    Art: string;
    Versicherung: string;
    Versicherungsnummer: string;
    Monatsbetrag?: number;
    Einmalzahlung?: number;
    Faelligkeit: string;
    Kommentar: string;

    constructor(init?: Partial<Absicherung>) {
        Object.assign(this, init);
    }
}