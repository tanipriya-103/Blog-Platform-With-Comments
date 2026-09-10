const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret === 'change_this_super_secret_key') {
    throw new Error('JWT_SECRET must be configured before starting the server');
  }

  return secret;
};

module.exports = { getJwtSecret };