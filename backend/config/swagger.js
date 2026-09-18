const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "api documentation",
            version: "1.0.0",
            description: "backend api documentation for all routes",
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path.join(__dirname, "../routes/*.js")], 
};

const specs = swaggerJsDoc(options);

module.exports = { swaggerUI, specs };