import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'yourSecretKey';

export function generateToken(payload: object, expiresIn = '1d') {
  const token= jwt.sign(payload, JWT_SECRET, { expiresIn });
  return token
}


export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);  
    return decoded; 
  } catch (err) {
    return null;  
  }
}
