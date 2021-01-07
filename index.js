const config = require('./config');
const ExpressApp = require('./app');
const logger = require('./system/logger');

const main = async () => {
    try {
        const app = new ExpressApp(config.port);
        app.addMiddlewares();
        await app.listen();
    } catch (error) {
        logger.error(error.stack);
        process.exit(1);
    }
}

main();


