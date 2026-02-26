
<template>

  <div class="signup-container">
    <AppLayout>
      <div class="signup-form">
        <h2>Sign Up</h2>
        <form @submit.prevent="handleRegister">
          <input type="text" v-model="fullname" placeholder="Full Name" required />
          <input type="email" v-model="email" placeholder="Email" required />
          <input type="text" v-model="phone" placeholder="Phone Number" required />
          <input type="text" v-model="id_number" placeholder="ID Number" required />
          <input type="text" v-model="location" placeholder="Location" required />
          <input type="date" v-model="dob" placeholder="Date of Birth" required />
          <input type="password" v-model="password" placeholder="Password" required />
          <button type="submit">Register</button>
        </form>
      </div>
    </AppLayout>
  </div>

</template>

<script> 
import axios from "axios";

export default {
  components: {
    AppLayout: () => import('./components/AppLayout.vue')
  },
   data() {
     return {
       fullname: "",
       email: "",
      phone:"",
      id_number:"",   
      location: "",
      dob:"",

      password: ""
     }
    },
    methods: {
      async handleRegister() {
         try {
            const response = await axios.post("http://localhost:3000/register", {
              fullname: this.fullname,
              email: this.email,
              phone: this.phone,
              id_number: this.id_number,
              dob: this.dob,
              location: this.location,
              password: this.password
            });
    
            alert("Registration successful!");
         } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
         }
        }
    }
}
</script>

<style>
</style>