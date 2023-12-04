import Utils from "../lib/Utils.js";
//import '/__/firebase/9.4.0/firebase-app-compat.js';
//import '/__/firebase/9.4.0/firebase-auth-compat.js';
//import '/__/firebase/init.js?useEmulator=true';
//import MB_Dlg_Btn from "/node_modules/menu-buddy/MB_Dlg_Btn.mjs";

class DE_Login extends HTMLElement 
{
  static tname = "de-login";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  get value()
  {
    let res = null;

    if (this?.login_panel?.hidden === false)
    {
      res = 
      {
        email: this.login_email.value,
        password: this.login_password.value, 
      };
    }
    else if (this?.signup_panel?.hidden === false)
    {
      res = 
      {
        email: this.email_input.value,
        password: this.password_input.value, 
        displayName: this.name_input.value
      };
    }
    else if (this?.forgot_panel?.hidden === false)
    {
      res = 
      {
        email: this.forgot_email_input.value,
      };
    }

    return res;
  }

  Hide_All()
  {
    this.login_panel.hidden = true;
    this.signup_panel.hidden = true;
    this.forgot_panel.hidden = true;
  }

  Show_Error(msg)
  {
    if (!this?.login_panel?.hidden)
    {
      this.login_error.innerText = msg;
      this.login_success.innerText = "";
    }
    else if (!this?.signup_panel?.hidden)
    {
      this.signup_error.innerText = msg;
      this.signup_success.innerText = "";
    }
    else if (!this?.forgot_panel?.hidden)
    {
      this.forgot_error.innerText = msg;
      this.forgot_success.innerText = "";
    }
  }

  Show_Success(msg)
  {
    if (!this?.login_panel?.hidden)
    {
      this.login_success.innerText = msg;
      this.login_error.innerText = "";
    }
    else if (!this?.signup_panel?.hidden)
    {
      this.signup_success.innerText = msg;
      this.signup_error.innerText = "";
    }
    else if (!this?.forgot_panel?.hidden)
    {
      this.forgot_success.innerText = msg;
      this.forgot_error.innerText = "";
    }
  }

  // events =============================================================================

  On_Click_Show_Sign_Up()
  {
    this.Hide_All();
    this.signup_panel.hidden = false;
  }

  On_Click_Show_Forgot()
  {
    this.Hide_All();
    this.forgot_panel.hidden = false;
  }

  On_Click_Google()
  {
    this.dispatchEvent(new Event("signin-google"));
  } 

  On_Click_Sign_In()
  {
    this.dispatchEvent(new Event("signin"));
  } 

  On_Click_Sign_Up(event) 
  {
    this.dispatchEvent(new Event("signup"));
  }

  On_Click_Forgot(event) 
  {
    this.dispatchEvent(new Event("forgot"));
  }

  // rendering ==========================================================================

  Render()
  {
    this.innerHTML = `
      <div cid="login_panel">
        <article>
          <h1>Welcome back</h1>
          <p class="new">New user? <a cid="signup_link">Sign up</a></p>
          <button cid="google_btn">Sign in with Google</button>
          <button cid="facebook_btn">Sign in with Facebook</button>
          <button cid="apple_btn">Sign in with Apple</button>
          <div class="or">
            <span>Or</span><hr>
          </div>

          <div><label>Your Email</label><input cid="login_email" type="email"></div>
          <a cid="forgot_link">Forgot your password</a>
          <div><label>Password</label><input cid="login_password" type="password"></div>
          <button cid="login_btn">Login</button>

          <span cid="login_error"></span>
          <span cid="login_success"></span>
        </article>
      </div>

      <div cid="signup_panel" hidden>
        <p>Already s user? <a cid="signin_link">Sign in</a></p>

        <div><label>Your Name</label><input cid="name_input" type="text"></div>
        <div><label>Your Email</label><input cid="email_input" type="email"></div>
        <div><label>Password</label><input cid="password_input" type="password"></div>
        <button cid="create_btn">Create Free Account</button>

        <span cid="signup_error"></span>
        <span cid="signup_success"></span>

        <p>
          By signing up you acknowledge that you have read and understood and agreed to our
          <a>Terms</a> and <a>Provacy Policy</a>
        </p>
      </div>

      <div cid="forgot_panel" hidden>
        <p>
          Enter the email address associated with your account and we'll send you an
          email that includes a link to reset your password.
        </p>

        <div><label>Your Email</label><input cid="forgot_email_input" type="email"></div>
        <button cid="forgot_btn">Send Reset Email</button>

        <span cid="forgot_error"></span>
        <span cid="forgot_success"></span>
      </div>

      <div cid="reset_panel" hidden>
        <div><label>New Password</label><input cid="new_password_input" type="password"></div>
        <button cid="reset_btn">Reset Password</button>
      </div>
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");
    Utils.On_Enter_Do_Click(this.login_btn);

    this.google_btn.addEventListener("click", this.On_Click_Google);
    this.login_btn.addEventListener("click", this.On_Click_Sign_In);
    this.create_btn.addEventListener("click", this.On_Click_Sign_Up);
    this.forgot_btn.addEventListener("click", this.On_Click_Forgot);

    this.signup_link.addEventListener("click", this.On_Click_Show_Sign_Up);
    this.forgot_link.addEventListener("click", this.On_Click_Show_Forgot);
  }
}

Utils.Register_Element(DE_Login);

export default DE_Login;