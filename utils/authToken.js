export const setTokenWithExpiration = (token) => {
    const expiresIn = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    const expirationTime = new Date(Date.now() + expiresIn);
    const tokenData = { token, expirationTime };
    localStorage.setItem('token', JSON.stringify(tokenData));
}