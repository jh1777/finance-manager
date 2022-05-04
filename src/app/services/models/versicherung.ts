import { IName } from "./interfaces/IName" 
export class Versicherung implements IName {
    id: number;
    _id?: string;
    Name: string;
    Rueckkaufswert: number;
    AusgabenId?: number;
    Datum: Date;

    _modified?: Date;
    _created?: Date;
    
    constructor(init?: Partial<Versicherung>) {
        Object.assign(this, init);
    }
}