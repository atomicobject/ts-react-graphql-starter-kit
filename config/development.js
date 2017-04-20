
module.exports = {
    databaseUrl: process.env.PG_DEV_URL || 'postgres://localhost/msl-dev',
    server: {
        requireAuth: false,
        requireSsl: false,
    }
}