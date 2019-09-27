module.exports = {
    client: {
        service: {
            name: "flight",
            url: "http://localhost:4000"
        }
    },
    includes: [
        "./src/**/*.{ts}",
        "./src/app/graphql/**/*.graphql"
    ]
}