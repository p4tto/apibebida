const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const sequelize = require('./models/Database')
const Usuario = require('./models/Usuário')

app.post('/api/criaUsuario', async (req,res)=>{
    // Usuario.create({nome: '2', senha:'2', moedas: 3})
    // let [test] = await sequelize.query(`SELECT * FROM usuarios`)
    
})
app.get('/api/deletaUsuario', (req,res)=>{
    // Usuario.findOne({where: {id: 3}})
    // .then((usuario)=>{
    //     usuario.destroy()
    // })
    // res.send('ok')
})

app.get('/api/adicionarMoeda', (req,res)=>{
    // Usuario.update()
})

app.get('/api/buscarMoeda',async (req, res)=>{
    // let [teste] = await sequelize.query(`SELECT moedas, nome, id FROM usuarios
    //                     WHERE nome = '2'`)
    // res.send(teste)
})
app.get('/api/removerMoeda',(req,res)=>{

})

app.get('/api/buscarRanking', async (req,res)=>{
    let [cinco] = await sequelize.query(`SELECT id, nome, moedas FROM usuarios
            ORDER BY moedas DESC
            LIMIT 5`)
})




const PORT = 8081
app.listen(PORT, () => console.log('Servidor rodando na porta: ' + PORT))