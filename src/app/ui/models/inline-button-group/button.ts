export class Button {
    label: string;
    id?: number;
    isSelected?: boolean = false;

    constructor(init? : Partial<Button>) {
        Object.assign(this, init);
    }
}