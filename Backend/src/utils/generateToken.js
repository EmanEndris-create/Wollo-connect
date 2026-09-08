const jwt = require('jsonwebtoken');

const generateToken = (res, userId) =>{
  const accessToken = jwt.sign(
    {userId},
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: '15m'}
  );

  const refreshToken = jwt.sign(
    {userId},
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: '7d'}
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return accessToken;
}

module.exports = generateToken;