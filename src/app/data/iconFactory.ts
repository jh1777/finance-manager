export const getIconWithName = (name: string): string => {
    switch (name) {
        case 'plus-circle-line':
            return '../assets/icons/plus-circle-line.svg';

        case 'info-standard-line':
            return '../assets/icons/info-standard-line.svg';

        case 'home-line':
            return '../assets/icons/home-line.svg';

        case 'wallet-line':
            return '../assets/icons/wallet-line.svg';
        
        case 'shield-line':
            return '../assets/icons/shield-line.svg';
            
        case 'cog-line':
            return '../assets/icons/cog-line.svg';
        default:
            break;
    }
};