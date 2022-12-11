export const getFile = async (path) => {
    const file = require(`../assets/${path}`);
    return fetch(file).then((res) => res.text().then((text) => text));
};
