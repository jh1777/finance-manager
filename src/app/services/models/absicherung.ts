import { IName } from './interfaces/IName';

export class Absicherung implements IName {
    Name: string;
    id?: number;
    _id?: string;
    Person: string;
    Versicherung: string;
    Versicherungsnummer: string;
    Berufsunfaehigkeit?: number;
    Todesfallsumme?: number;
    Monatsbetrag?: number;
    Einmalzahlung?: number;
    Faelligkeit: Date;
    Kommentar: string;

    _created?: Date;
    _modified?: Date;

    constructor(init?: Partial<Absicherung>) {
        Object.assign(this, init);
    }
}