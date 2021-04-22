export const getIconWithName = (name: string): string => {
    switch (name) {
        case 'plus-circle-line':
            return '../assets/icons/plus-circle-line.svg';

        case 'info-standard-line':
            return '../assets/icons/info-standard-line.svg';

        case 'home-line':
            return '../assets/icons/home-line.svg';

        case 'trash-line':
            return "../assets/icons/trash-line.svg";
            
        case 'wallet-line':
            return '../assets/icons/wallet-line.svg';
        
        case 'shield-line':
            return '../assets/icons/shield-line.svg';
            
        case 'cog-line':
            return '../assets/icons/cog-line.svg';

        case 'times-circle-line':
            return '../assets/icons/times-circle-line.svg';

        case 'bar-chart-line':
            return '../assets/icons/bar-chart-line.svg';
        
        case 'filter-line':
            return '../assets/icons/filter-line.svg';

        case 'filter-solid':
            return '../assets/icons/filter-solid.svg';


        case 'folder-line':
            return '../assets/icons/folder-line.svg';

        case 'folder-open-line':
            return '../assets/icons/folder-open-line.svg';
                    
        default:
            break;
    }
};