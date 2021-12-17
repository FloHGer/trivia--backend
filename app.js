const app = require('express')();

app.use((req, res) => res.send('<h1>TRIVIA GAME backend</h1>'));

const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`server up on PORT: ${port}`));