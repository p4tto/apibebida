const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sequelize = require("./models/Database");
const Usuario = require("./models/Usuário");
const cors = require("cors");

// habilita CORS
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    methods: ["*"],
    allowedHeaders: ["*"],
  })
);

// validar conexão com banco
sequelize
  .authenticate({ logging: false })
  .then(function (err) {
    console.log("Conectado ao banco de dados.");
  })
  .catch(function (err) {
    console.log(err, "\nNão foi possível se conectar ao banco de dados.");
    process.exit(1);
  });

app.post("/api/criaUsuario", async (req, res) => {
  try {
    console.log(req.body);

    let nomeUsuario = req.body.nomeUsuario;

    await sequelize
      .query(`SELECT nome FROM usuarios WHERE nome = '${nomeUsuario}'`)
      .then(([[resultado]]) => {
        if (resultado) {
          res
            .status(409)
            .send({ message: `O usuário ${nomeUsuario} já existe.` });
        } else {
          try {
            Usuario.create({ nome: nomeUsuario, moedas: 0 }).then(() => {
              res.send({
                status: "ok",
                message: `Usuário ${nomeUsuario} criado com sucesso!`,
              });
              res.status(200);
            });
          } catch (error) {
            res.status(500).send({ message: "Erro" });
          }
        }
      });
  } catch (error) {
    res.status(500).send({ message: "Erro" });
  }
});

app.delete("/api/deletaUsuario", (req, res) => {
  try {
    let nomeUsuario = req.body.nomeUsuario;

    Usuario.findOne({ where: { nome: nomeUsuario } }).then((usuario) => {
      if (usuario) {
        usuario.destroy();
        res.status(200).send({
          status: "ok",
          message: `Usuário ${nomeUsuario} deletado com sucesso.`,
        });
      } else {
        res
          .status(404)
          .send({ message: `Usuário ${nomeUsuario} não encontrado` });
      }
    });
  } catch (error) {
    res.status(500).send({ message: `Erro` });
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
        res.send({ message: "ok" });
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
          res.status(404).send({ message: "Usuário não encontrado" });
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
        res.send({ message: "ok" });
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
          res.send({ message: "Não foram encontrados usuários" });
        }
      });
  } catch (error) {
    res.status(500);
  }
});

const PORT = 8081;
app.listen(PORT, () => console.log("Servidor rodando na porta: " + PORT));
