import { IName } from './interfaces/IName';

export class Absicherung implements IName {
    Name: string;
    id?: number;
    _id?: string;
    Erstellt: string;
    Bearbeitet: string;
    Person: string;
    Versicherung: string;
    Versicherungsnummer: string;
    Berufsunfaehigkeit?: number;
    Todesfallsumme?: number;
    Monatsbetrag?: number;
    Einmalzahlung?: number;
    Faelligkeit: string;
    Kommentar: string;

    constructor(init?: Partial<Absicherung>) {
        Object.assign(this, init);
    }
}