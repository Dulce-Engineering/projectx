import Utils from './Utils.js';

class Admin
{
  static token_prefix_length = "Firebase ".length;

  static async UID(req, fb_auth)
  {
    const token = await Admin.Token(req, fb_auth);
    return token?.uid;
  }

  static async Has_Auth(req, fb_auth)
  {
    const token = await Admin.Token(req, fb_auth);
    //console.log("token: ", token);
    return token && token.uid != null && token.uid != undefined;
  }
  
  static async Token(req, fb_auth)
  {
    let token = null;

    const auth = req.headers?.authorization;
    if (auth)
    {
      const token_str = auth.substring(Admin.token_prefix_length);

      try
      {
        token = await fb_auth.verifyIdToken(token_str);
      }
      catch (error)
      {
        console.error(error);
      }
    }
  
    return token;
  }

  static async Refresh_Token(user)
  {
    if (user)
    {
      const refresh_token = user.stsTokenManager.refreshToken;
      const api_key = user.apiKey;
      const url = "https://securetoken.googleapis.com/v1/token?key=" + api_key;
      const body = JSON.stringify({grant_type:"refresh_token",refresh_token});
      const res_obj = await Utils.fetchJson(url, "post", null, body);
      if (res_obj)
      {
        const exp_time = Date.now() + res_obj.expires_in * 1000;
        user.stsTokenManager.expirationTime = exp_time;
        user.stsTokenManager.refreshToken = res_obj.refresh_token;
      }
    }

    return user;
  }
}

export default Admin;