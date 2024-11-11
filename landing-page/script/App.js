function navigateToSignup() {
    window.location.href = 'signup.html';
  }
  
  function navigateToLogin() {
    window.location.href = 'login.html';
  }
  
  // Signup logic
  function signupUser(event) {
    event.preventDefault();
    const role = document.getElementById('role').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    console.log(`User Signed Up - Role: ${role}, Name: ${name}, Email: ${email}`);
  
    sessionStorage.setItem('role', role);
    
    alert('Signup successful! Please login.');
    window.location.href = 'login.html';
  }
  
  // Login logic
  function loginUser(event) {
    event.preventDefault();
    const name = document.getElementById('loginName').value;
    const password = document.getElementById('loginPassword').value;
  
    const role = sessionStorage.getItem('role');
  
    if (role === 'Administrator') {
      window.location.href = 'https://school-management-frontend-steel.vercel.app/dashboard';
    } else if (role === 'Teacher') {
      window.location.href = 'https://school-management-frontend-steel.vercel.app/dashboard';
    } else if (role === 'Investigator') {
      window.location.href = 'https://school-management-frontend-steel.vercel.app/dashboard';
    } else {
      alert('Login failed: Role not recognized');
    }
  }
  