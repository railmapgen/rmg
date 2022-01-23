export const getRandomId = () =>
    Math.floor(Math.random() * Math.pow(36, 4))
        .toString(36)
        .padStart(4, '0');
