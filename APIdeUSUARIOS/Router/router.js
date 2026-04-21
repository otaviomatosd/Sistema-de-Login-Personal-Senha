const express = require("express");
const bcrypt = require("bcrypt");
const usuarios = require("../models/usuario.js");

const router = express.Router();


// 🔍 GET - listar todos usuários
router.get("/", async (req, res) => {
  try {
    const user = await usuarios.findAll();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔍 GET por ID
router.get("/:id", async (req, res) => {
  try {
    const user = await usuarios.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ➕ POST - criar usuário (com bcrypt)
router.post("/", async (req, res) => {
  try {
    const { name,role,personal,password } = req.body;

    const senhaHash = await bcrypt.hash(password, 10);

    const novoUsuario = await usuarios.create({
      name,
      role,
      personal,
      password: senhaHash
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✏️ PUT - atualizar usuário
router.put("/:id", async (req, res) => {
  try {
    const { name, role,personal, password } = req.body;

    const user = await usuarios.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    let senhaHash = user.password;

    if (password) {
      senhaHash = await bcrypt.hash(password, 10);
    }

    await user.update({
      name,
      role,
      personal,
      password: senhaHash
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ❌ DELETE - deletar usuário
router.delete("/:id", async (req, res) => {
  try {
    const user = await usuarios.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await user.destroy();

    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;