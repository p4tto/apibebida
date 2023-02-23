const express = require('express')
const app = express()

app.get('/', (req,res)=>{
    res.send('ok')
})


const PORT = 8081
app.listen(PORT, () => console.log('Servidor rodando na porta: ' + PORT))