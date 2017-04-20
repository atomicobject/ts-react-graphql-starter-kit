module.exports = {
    databaseUrl: process.env.PG_TEST_URL || 'postgres://localhost/msl-test',
    server: {
        requireAuth: false,
        requireSsl: false,
    }
}