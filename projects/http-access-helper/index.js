const { createApp } = require('./src/app');

const requestTimeout = +process.env.HTTP_ACCESS_HELPER_TIMEOUT || 60000; // 1 min
const port = +process.env.HTTP_ACCESS_HELPER_PORT || 8989;

const app = createApp(requestTimeout);

app.listen(port, () => console.log(`Http Access Helper app listening on port ${port}!\n`));
