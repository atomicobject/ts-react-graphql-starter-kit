
module.exports = {
    databaseUrl: process.env.DEV_DATABASE_URL || process.env.DATABASE_URL,
    server: {
        requireSsl: false,
        graphiql: true
    }
}