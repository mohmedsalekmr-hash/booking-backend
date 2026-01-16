const express = require('express');
const app = express();
const PORT = 3000;

app.get('/health', (req, res) => {
    res.send('Simple Server Working');
});

app.listen(PORT, () => {
    console.log(`Simple Server running on port ${PORT}`);
});
