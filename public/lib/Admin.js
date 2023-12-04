import Utils from "./Utils.js";
import config from "./config.js";

class Admin
{
  static LS_KEY = "de_fb_user";

  /**
   * Indicates whether a user is logged in or not.
   * @static
   * @returns {boolean}
   */
  static Is_Logged_In()
  {
    let res = false;

    const user = Admin.Get_User();
    if (user)
    {
      const exp_time = user.stsTokenManager.expirationTime;
      const now = Date.now();
      res = exp_time > now;
    }

    return res;
  }

  static Set_User(user)
  {
    if (user)
    {
      Utils.setLocalStorgeJson(Admin.LS_KEY, user);
    }
    else
    {
      localStorage.removeItem(Admin.LS_KEY);
    }
  }

  static Get_User()
  {
    return Utils.Get_From_Storage_JSON(localStorage, Admin.LS_KEY, null);
  }
  
  static async Import_API()
  {
    const user = Admin.Get_User();
    const token = user?.stsTokenManager?.accessToken;
    await Utils.Import_API(config.get(), null, null, token, Admin.On_Error);
  }

  static On_Error(url, options, http_json)
  {
    if (http_json.error.stack)
    {
      console.error(http_json.error.stack);
    }
    else
    {
      console.error(http_json.error.code + ": " + http_json.error.message);
    }
    
    if (http_json.error.code == "RPC_ERROR_NO_AUTH")
    {
      window.open("/index.html", "_top");
    }
  }
}

export default Admin;
