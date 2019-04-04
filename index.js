
window.addEventListener('load', () => {
    // var slider = document.getElementById("step1Range");
    // var output = document.getElementById("demo");
    // output.innerHTML = slider.value; // Display the default slider value

    // changes slider value in the page
    // slider.addEventListener('input', ()  => {
    //     output.innerHTML = slider.value;
    // });
    var idToken;
    var accessToken;
    var expiresAt;

    var webAuth = new auth0.WebAuth({
      domain: 'hackerfitness.auth0.com',
      clientID: 'YoSaS0XcbdpghK0CNT4jXGn6EfPJNgJO',
      responseType: 'token id_token',
      scope: 'openid',
      redirectUri: 'http://localhost:5500/'
    });
  
    var loginBtn = document.getElementById('btn-login');
  
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      webAuth.authorize();
    });

    // ...
    var loginStatus = document.querySelector('.loginStatusContainer h4');
    var loginView = document.getElementById('login-view');
    var homeView = document.getElementById('home-view');
  
    // buttons and event listeners
    var loginBtn = document.getElementById('btn-login');
    var logoutBtn = document.getElementById('btn-logout');
  
    var start = document.getElementById('start');
    start.addEventListener('click', () => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            var openingContainer = document.getElementsByClassName('openingContainer');
            openingContainer[0].style.display = 'none';
        }    
    })

  
    logoutBtn.addEventListener('click', logout);

    if (localStorage.getItem('isLoggedIn') === 'true') {
        console.log('youre already signed in my dude')
        renewTokens();
        start.innerHTML = 'Get Started';
      } else {
        handleAuthentication();
        start.innerHTML = 'Sign In to Get Started';
      }
  
    function handleAuthentication() {
      webAuth.parseHash(function(err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          localLogin(authResult);
          loginBtn.style.display = 'none';
          homeView.style.display = 'inline-block';
        } else if (err) {
          homeView.style.display = 'inline-block';
          console.log(err);
          alert(
            'Error: ' + err.error + '. Check the console for further details.'
          );
        }
        displayButtons();
      });
    }
  
    function localLogin(authResult) {
      // Set isLoggedIn flag in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      // Set the time that the access token will expire at
      expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      accessToken = authResult.accessToken;
      idToken = authResult.idToken;
    }
  
    function renewTokens() {
      webAuth.checkSession({}, (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          localLogin(authResult);
        } else if (err) {
          alert(
              'Could not get a new token '  + err.error + ':' + err.error_description + '.'
          );
          logout();
        }
        displayButtons();
      });
    }
  
    function logout() {
      // Remove isLoggedIn flag from localStorage
      localStorage.removeItem('isLoggedIn');
      // Remove tokens and expiry time
      accessToken = '';
      idToken = '';
      expiresAt = 0;
      displayButtons();
    }
  
    function isAuthenticated() {
      // Check whether the current time is past the
      // Access Token's expiry time
      var expiration = parseInt(expiresAt) || 0;
      return localStorage.getItem('isLoggedIn') === 'true' && new Date().getTime() < expiration;
    }
  
    function displayButtons() {
      if (isAuthenticated()) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        // loginStatus.innerHTML = 'You are logged in!';
        // loginStatus.style.textAlign = "right";
      } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        // loginStatus.innerHTML =
        //   'You are not logged in! Please log in to continue.';
        //   loginStatus.style.textAlign = "right";
      }
    }
  });

