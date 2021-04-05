export function FillZero(item: number, digits: number = 2): string {
    switch (digits) {
        case 2:
            if (item < 10) {
                return `0${item}`;
            } else {
                return `${item}`;
            }
            break;
    
        default:
            break;
    }
}