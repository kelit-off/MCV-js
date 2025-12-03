const express = require('express');
const app = express();
const webRoutes = require('./routes/web');

app.use('/', webRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
