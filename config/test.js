module.exports = {
    databaseUrl: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    server: {
        requireAuth: false,
        requireSsl: false,
    }
}