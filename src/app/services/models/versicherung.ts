import { IName } from "./interfaces/IName" 
import { IDatum } from './interfaces/IDatum';
export class Versicherung implements IName, IDatum {
    id: number;
    _id?: string;
    Name: string;
    Rueckkaufswert: number;
    AusgabenId?: number;
    Datum: string;
    Erstellt: string;

    _created?: string;
    _modified?: string;
    
    constructor(init?: Partial<Versicherung>) {
        Object.assign(this, init);
    }
}