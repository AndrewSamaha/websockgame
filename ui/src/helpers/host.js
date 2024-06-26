export const getHost = () => {
    const hostname = window.location.hostname;
    console.log('hostname', hostname);

    return `http://${hostname}:3000`;
}
