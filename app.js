const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sequelize = require("./models/Database");
const Usuario = require("./models/Usuário");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post("/api/criaUsuario", async (req, res) => {
  try {
    console.log(req.body);

    let nomeUsuario = req.body.nomeUsuario;

    await Usuario.create({ nome: nomeUsuario, moedas: 0 }).then(() => {
      res.send("ok");
      res.status(200);
    });
  } catch (error) {
    res.status(500);
  }
});

app.delete("/api/deletaUsuario", (req, res) => {
  try {
    let nomeUsuario = req.body.nomeUsuario;

    Usuario.findOne({ where: { nome: nomeUsuario } }).then((usuario) => {
      usuario.destroy();
      res.send("ok");
    });
  } catch (error) {
    res.status(500);
  }
});

app.post("/api/adicionarMoeda", async (req, res) => {
  try {
    let nomeUsuario = req.body.nomeUsuario;
    let moedasNovas = req.body.moedasNovas;

    await sequelize
      .query(
        `UPDATE usuarios SET moedas = moedas + ${moedasNovas} WHERE nome = '${nomeUsuario}'`
      )
      .then(() => {
        res.send("ok");
        res.status(200);
      });
  } catch (error) {
    res.status(500);
  }
});

app.get("/api/buscarMoeda/:nomeUsuario", async (req, res) => {
  try {
    let nomeUsuario = req.params.nomeUsuario;

    await sequelize
      .query(`SELECT nome, moedas FROM usuarios WHERE nome = '${nomeUsuario}'`)
      .then(([[resultado]]) => {
        console.log(resultado);
        if (resultado) {
          res.send(JSON.stringify(resultado));
        } else {
          res.status(404).send("Usuário não encontrado");
          // res.send("Usuário não encontrado")
        }
      });
  } catch (error) {
    res.status(500);
  }
});
app.post("/api/removerMoeda", async (req, res) => {
  try {
    let nomeUsuario = req.body.nomeUsuario;
    let moedasGastas = req.body.moedasGastas;

    await sequelize
      .query(
        `UPDATE usuarios SET moedas = moedas - ${moedasGastas} WHERE nome = '${nomeUsuario}'`
      )
      .then(() => {
        res.send("ok");
        res.status(200);
      });
  } catch (error) {
    res.status(500);
  }
});

app.get("/api/buscarRanking", async (req, res) => {
  try {
    await sequelize
      .query(
        `SELECT id, nome, moedas FROM usuarios
            ORDER BY moedas DESC
            LIMIT 5`
      )
      .then(([resultado]) => {
        if (resultado.length > 0) {
          res.send(JSON.stringify(resultado));
          res.status(200);
        } else {
          res.send("Não foram encontrados usuários");
        }
      });
  } catch (error) {
    res.status(500);
  }
});

const PORT = 8081;
app.listen(PORT, () => console.log("Servidor rodando na porta: " + PORT));
