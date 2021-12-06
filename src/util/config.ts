import packageJson from '../../package.json';

export enum Environments {
    DEV = 'DEV',
    UAT = 'UAT',
    PRD = 'PRD',
}

export const getEnvironment = () => {
    if (window.location.hostname === 'localhost') {
        return Environments.DEV;
    } else if (window.location.pathname.includes('uat')) {
        return Environments.UAT;
    } else {
        return Environments.PRD;
    }
};

export const getVersion = () => {
    return packageJson.version;
};
