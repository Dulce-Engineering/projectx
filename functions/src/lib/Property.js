import Utils from './Utils.js';

class Property
{
  static table = "property";

  constructor()
  {
    this.id = null;
    this.address = null;
    this.uid = null;
  }

  Save(db)
  {
    return db.Save(this, Property.table);
  }

  static New()
  {
    return new Property();
  }

  static async Save(db, uid, details)
  {
    let res = null;

    if (uid)
    {
      const property = Property.New();
      property.id = details.id;
      property.address = details.address;
      property.uid = uid;
      res = await property.Save(db);
    }

    return res;
  }

  static async Select(db, uid)
  {
    let objs = null;

    if (uid)
    {
      const where = [{field: "uid", op: "==", value: uid}];
      objs = await db.Select_Objs(Property.table, Property, where, null, null);
    }

    return objs;
  }
}

export default Property;