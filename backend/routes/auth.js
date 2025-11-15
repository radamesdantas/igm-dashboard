import express from 'express';

const router = express.Router();

// Credenciais padrão (em produção, isso deveria estar em um banco de dados com hash)
const USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'igm2025',
    name: 'Administrador'
  }
];

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Usuário e senha são obrigatórios'
    });
  }

  const user = USERS.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: 'Usuário ou senha inválidos'
    });
  }

  // Não retornar a senha
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    message: 'Login realizado com sucesso',
    user: userWithoutPassword
  });
});

export default router;
