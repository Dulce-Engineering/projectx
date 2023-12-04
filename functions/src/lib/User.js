import Utils from './Utils.js';

class User
{
  static table = "user";

  constructor()
  {
    this.id = null;
    this.name = null;
    this.email = null;
    this.phone = null;
    this.status = null;
  }

  Save(db)
  {
    return db.Save(this, User.table);
  }

  static New()
  {
    return new User();
  }

  static async Sign_In(db, user_details)
  {
    let res = null;

    const user_exists = await db.Exists(User.table, user_details.id);
    if (!user_exists) 
    {
      const user = User.New();
      user.id = user_details.id;
      user.name = user_details.displayName;
      user.email = user_details.email;
      user.status = "active";
      res = user.Save(db);
    }

    return res;
  }

  static async Create(db, fb_auth, user_details)
  {
    let res = null;

    // user_details = {email, password, displayName}
    const fb_user = await fb_auth.createUser(user_details);
    if (fb_user) 
    {
      const user = User.New();
      user.id = fb_user.uid;
      user.name = user_details.displayName;
      user.email = user_details.email;
      user.status = "active";
      res = user.Save(db);
    }

    return res;
  }
}

export default User;