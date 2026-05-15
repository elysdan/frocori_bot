const app = require('./src/app');
const { PORT } = require('./src/config/env');

app.listen(PORT, () => {
    console.log(`\nListening on port ${PORT}\n`);
});
