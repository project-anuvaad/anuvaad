const HOSTNAME = process.env.HOSTNAME === 'development'  ? 'auth.anuvaad.org' : 'users-auth.anuvaad.org'

module.exports = { HOSTNAME }