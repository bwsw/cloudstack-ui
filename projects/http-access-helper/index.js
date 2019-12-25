const { createApp } = require('./src/app');

const requestTimeout = 6000; // 1 min
const port = 8989;

const app = createApp(requestTimeout);

app.listen(port, () => console.log(`Http Access Helper app listening on port ${port}!\n`));
