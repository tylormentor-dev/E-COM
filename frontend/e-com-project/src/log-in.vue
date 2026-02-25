<template>
  <div class="login-container">
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <img class="logo-image" alt="Company Logo">
        </div>
        <div class="company-info">
          <h1 class="company-name">{{ companyname }}</h1>
          <h3 class="slogan">{{ slogan }}</h3>
        </div>

      </div>
    </header>

    <section class="login-section">
      <form @submit.prevent="handleLogin" class="log-form">
        <h1 class="log-title">Welcome Back</h1>
        <p class="login-subtitle">Sign in to your account</p>

        <div class="form-group">
          <label for="username" class="la-username">
             Username
          </label>
          <input 
            v-model="username"
            type="text" 
            class="username" 
            name="username" 
            placeholder="Enter your username"
            required
          >
        </div>

        <div class="form-group">
          <label for="password" class="la-password">
             Password
          </label>
          <div class="password-wrapper">
            <input 
              v-model="password"
              :type="showPassword ? 'text' : 'password'" 
              class="password" 
              name="password" 
              placeholder="Enter your password"
              required
            >
            <button 
              type="button" 
              class="toggle-password-btn"
              @click="showPassword = !showPassword"
              :title="showPassword ? 'Hide password' : 'Show password'"
            >
              {{ showPassword ? 'X' : '👁️' }}
            </button>
          </div>
        </div>

        <div class="checkbox-group">
          <input 
            v-model="rememberMe"
            type="checkbox" 
            id="remember" 
            class="remember-checkbox"
          >
          <label for="remember" class="remember-label">Remember me</label>
        </div>

        <div class="l-btns">
          <button type="submit" class="log-in-btn">Log In</button>
          <button type="button" @click="navigateToSignUp" class="sign-up-btn">Sign Up</button>
        </div>

        <button type="button" @click="handleForgotPassword" class="forgot-password-btn">
          Forgot Password?
        </button>
      </form>
    </section>
  </div>
</template>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  min-height: 100vh;
  background-image:url(auto-parts-1.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
}

.header {
  background:  linear-gradient(135deg, #080808, #383838, rgb(143, 142, 142), #56555a);
  padding: 20px 40px;
  border-bottom: 3px solid rgba(212, 212, 212, 0.61);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.header-content {
  display: flex;
  align-items: center;
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid rgba(173, 174, 180, 0.692);
  background-image: url(images.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 5px;
  box-shadow: 0 0 15px rgba(246, 247, 252, 0.5);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.company-info {
  color: white;
}

.company-name {
  font-size: 36px;
  font-weight: bold;
  background: linear-gradient(135deg, #001a8d 0%, #4ea3e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 5px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  animation: fadeInLeft 0.8s ease-out;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slogan {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  animation: fadeInLeft 0.8s ease-out 0.1s both;
}

.login-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.log-form {
  background: white;
  background-image: linear-gradient(rgba(95, 91, 92, 0.95), rgba(241, 235, 235, 0.95));
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 45px 35px;
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 420px;
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.log-title {
  text-align: center;
  color: #005cb3ce;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-subtitle {
  text-align: center;
  color: #005cb3ce;
  font-size: 14px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.la-username,
.la-password {
  display: block;
  font-weight: 600;
  color: #005cb3ce;
  font-size: 14px;
  margin-bottom: 8px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.icon {
  margin-right: 8px;
  font-size: 16px;
}

.username,
.password {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.username:focus,
.password:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.username::placeholder,
.password::placeholder {
  color: #bbb;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper .password {
  padding-right: 45px;
}

.toggle-password-btn {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
  transition: transform 0.2s ease;
}

.toggle-password-btn:hover {
  transform: scale(1.2);
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  gap: 8px;
}

.remember-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: gray;
}

.remember-label {
  color: #666;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.l-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.log-in-btn,
.sign-up-btn {
  flex: 1;
  min-width: 140px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.log-in-btn {
  background: linear-gradient(135deg, black 0%, silver 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(195, 198, 211, 0.4);
}

.log-in-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(90, 94, 109, 0.6);
}

.log-in-btn:active {
  transform: translateY(0);
}

.sign-up-btn {
  background: white;
  color: #888888;
  border: 2px solid #727272;
}

.sign-up-btn:hover {
  background: gray;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.sign-up-btn:active {
  transform: translateY(0);
}

.forgot-password-btn {
  background-color: transparent;
  border: none;
  color: black;
  cursor: pointer;
  text-decoration: none;
  display: block;
  margin: 0 auto;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.forgot-password-btn:hover {
  text-decoration: underline;
  color: gray;
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .company-name {
    font-size: 28px;
  }

  .slogan {
    font-size: 16px;
  }

  .log-form {
    max-width: 100%;
    padding: 35px 25px;
  }

  .l-btns {
    flex-direction: column;
  }

  .log-in-btn,
  .sign-up-btn {
    min-width: 100%;
  }
}
</style>

<script>
import axios from "axios";

export default {
  name: 'LoginPage',

  data() {
    return {
      username: '',
      password: '',
      rememberMe: false,
      showPassword: false,
      errorMessage: '',
      companyname: 'MECHANIC CONNECT',
      slogan: 'Your Best Friend In Automotive Solutions'
    }
  },

  methods: {
    async handleLogin() {
      try {
        const response = await axios.post(
          "http://localhost:3000/login",
          {
            email: this.username,  
            password: this.password
          }
        );

        localStorage.setItem("user", JSON.stringify(response.data.user));

        this.$router.push("/dashboard"); 

      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "Login failed";
        alert(this.errorMessage);
      }
    },

    navigateToSignUp() {
      this.$router.push("/register");
    },

    handleForgotPassword() {
      const email = prompt('Please enter your registered email address:');
      if (email) {
        alert('Password reset link has been sent to ' + email);
      }
    }
  }
}
</script>