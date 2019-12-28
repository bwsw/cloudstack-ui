const { createApp } = require('./src/app');
const { requestTimeout, port } = require('./config');

const app = createApp(requestTimeout);

app.listen(port, () => console.log(`Http Access Helper app listening on port ${port}!\n`));
