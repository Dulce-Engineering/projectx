//import Db_Firestore from './Db_Firestore.js';
//import Utils from './Utils.js';

class User
{
  static table = "user";

  constructor()
  {
    this.id = null;
    this.uid = null;
    this.user_id = null;
    this.name = null;
    this.email = null;
    this.phone = null;
    this.address = null;
    this.status = null;
    this.property_id = null;
  }

  Save(db)
  {
    return db.Save(this, User.table);
  }

  static New()
  {
    return new User();
  }

  static async Select_Contacts(db, user)
  {
    let objs = null;

    if (user)
    {
      const where = [{field: "user_id", op: "==", value: user.id}];
      objs = await db.Select_Objs(User.table, User, where, null, null);
    }

    return objs;
  }

  static Select_By_UID(db, uid)
  {
    const where = [{field:"uid", op:"==", value:uid}];
    return db.Select_Obj(User.table, User, where);
  }

  static async Save(db, user, details)
  {
    let res = null;

    if (user)
    {
      const new_user = User.New();
      new_user.id = details.id;
      //new_user.uid = null;
      new_user.user_id = user.id;
      new_user.name = details.name;
      new_user.email = details.email;
      new_user.phone = details.phone;
      new_user.address = details.address;
      new_user.status = details.status;
      new_user.property_id = details.property_id;
      res = await new_user.Save(db);
    }

    return res;
  }

  static async Sign_In(db, user_details)
  {
    let res = null;

    const existing_user = await User.Select_By_UID(db, user_details.uid);
    if (!existing_user) 
    {
      const user = User.New();
      user.uid = user_details.uid;
      user.name = user_details.displayName;
      user.email = user_details.email;
      user.status = "active";
      res = await user.Save(db);
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
      user.uid = fb_user.uid;
      user.name = user_details.displayName;
      user.email = user_details.email;
      user.status = "active";
      res = await user.Save(db);

      //fb_auth.sendEmailVerification(fb_user);
    }

    return res;
  }
}

export default User;