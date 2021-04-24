import { IName } from "./interfaces/IName" 
import { IDatum } from './interfaces/IDatum';
export class Versicherung implements IName, IDatum {
    id: number;
    Name: string;
    Rueckkaufswert: number;
    AusgabenId?: number;
    Datum: string;
    Erstellt: string;

    constructor(init?: Partial<Versicherung>) {
        Object.assign(this, init);
    }
}