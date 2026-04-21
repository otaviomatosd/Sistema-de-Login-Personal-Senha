<template>
  <div id="app">
    <div v-if="!isAuthenticated" class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Bem-vindo</h2>
          <p>Faça login para continuar</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Personal</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              placeholder="******"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              placeholder="********"
              required
            />
          </div>

          <button type="submit" :disabled="loading" class="login-button">
            {{ loading ? "Entrando..." : "Entrar" }}
          </button>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div class="register-link">
            <a href="#" @click.prevent="showRegister = true">Não tem conta? Cadastre-se</a>
          </div>
        </form>
      </div>

      <div v-if="showRegister" class="modal" @click.self="showRegister = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Criar Conta</h3>
            <button class="close-btn" @click="showRegister = false">×</button>
          </div>
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="reg-name">Nome</label>
              <input type="text" id="reg-name" v-model="registerForm.name" required />
            </div>
            <div class="form-group">
              <label for="reg-email">Email</label>
              <input type="email" id="reg-email" v-model="registerForm.email" required />
            </div>
            <div class="form-group">
              <label for="reg-password">Senha</label>
              <input type="password" id="reg-password" v-model="registerForm.password" required />
            </div>
            <button type="submit" :disabled="registerLoading" class="register-button">
              {{ registerLoading ? "Cadastrando..." : "Cadastrar" }}
            </button>
            <div v-if="registerError" class="error-message">{{ registerError }}</div>
          </form>
        </div>
      </div>
    </div>

    <div v-else class="dashboard">
      <nav class="navbar">
        <h2>Dashboard</h2>
        <button @click="logout" class="logout-btn">Sair</button>
      </nav>

      <div class="content">
        <div class="welcome-card">
          <h3>Olá, {{ user.name }}!</h3>
          <p>Email: {{ user.email }}</p>
          <p>ID: {{ user.id }}</p>
        </div>

        <div class="info-card">
          <h4>Bem-vindo ao sistema!</h4>
          <p>Você está logado com sucesso.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const isAuthenticated = ref(false);
const user = ref({});
const loading = ref(false);
const errorMessage = ref("");
const showRegister = ref(false);
const registerLoading = ref(false);
const registerError = ref("");

const form = ref({
  email: "",
  password: "",
});

const registerForm = ref({
  name: "",
  email: "",
  password: "",
});

onMounted(() => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (token && userData) {
    isAuthenticated.value = true;
    user.value = JSON.parse(userData);
  }
});

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.post("http://localhost:3000/api/login", form.value);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      isAuthenticated.value = true;
      user.value = response.data.user;

      form.value.email = "";
      form.value.password = "";
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Erro ao fazer login";
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  registerLoading.value = true;
  registerError.value = "";

  try {
    const response = await axios.post("http://localhost:3000/api/register", registerForm.value);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      isAuthenticated.value = true;
      user.value = response.data.user;
      showRegister.value = false;

      registerForm.value = {
        name: "",
        email: "",
        password: "",
      };
    }
  } catch (error) {
    registerError.value = error.response?.data?.message || "Erro ao cadastrar";
  } finally {
    registerLoading.value = false;
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  isAuthenticated.value = false;
  user.value = {};
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #333;
  font-weight: 500;
}

.form-group input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
}

.register-link a:hover {
  text-decoration: underline;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  padding: 30px;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.register-button {
  background: #28a745;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  background: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logout-btn {
  background: #dc3545;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.content {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card,
.info-card {
  background: white;
  border-radius: 10px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.welcome-card h3 {
  color: #333;
  margin-bottom: 15px;
}

.info-card h4 {
  color: #667eea;
  margin-bottom: 10px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-header h2 {
    font-size: 24px;
  }
}
</style>
