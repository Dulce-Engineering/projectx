import Utils from './Utils.js';

class Property
{
  static table = "property";

  constructor()
  {
    this.id = null;
    this.address = null;
    this.user_id = null;
  }

  Save(db)
  {
    return db.Save(this, Property.table);
  }

  static New()
  {
    return new Property();
  }

  static async Save(db, user, details)
  {
    let res = null;

    if (user)
    {
      const property = Property.New();
      property.id = details.id;
      property.address = details.address;
      property.user_id = user.id;
      res = await property.Save(db);
    }

    return res;
  }

  static async Select(db, user)
  {
    let objs = null;

    if (user)
    {
      const where = [{field: "user_id", op: "==", value: user.id}];
      objs = await db.Select_Objs(Property.table, Property, where, null, null);
    }

    return objs;
  }

  /**
   * Returns the property objected with the matching id.
   * @param {Db_Firestore} db 
   * @param {User} user 
   * @param {String} id 
   * @returns Property
   */
  static async Select_By_Id(db, user, id)
  {
    let res = null;

    if (user && id)
    {
      const obj = await db.Select_Obj_By_Id(id, Property.table, Property);
      res = obj.user_id == user.id ? obj : null;
    }

    return res;
  }

  static async Select_As_Options(db, user)
  {
    let options = null;

    const properties = await Property.Select(db, user);
    if (!Utils.isEmpty(properties))
    {
      options = properties.map(p => {return {value: p.id, text: p.address}});
    }

    return options;
  }
}

export default Property;