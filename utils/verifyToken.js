import jwt from 'jsonwebtoken'

// signing jwt
export function signJwtToken(payload, options = {}) {
    const secret = "123456";
    const token = jwt.sign(payload, secret, options);
    return token;
}


// verifying jwt
export function verifyJwtToken(token) {
    try {
        const secret = "123456";
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (error) {
        console.error(error);
        return null;
    }
}