const LOGREQUESTS = false

export const makeApiRequest = async (url, method, body = '') => {
    if (LOGREQUESTS) {
        console.log(`URL: ${url},\nMETHOD: ${method},\nBODY: ${JSON.stringify(body)}`);
    }
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer: ${localStorage.getItem('AuthToken')}`
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    return response.json();
}