import Utils from "./Utils.js";

class Db_Firestore
{
  constructor(fb_db)
  {
    this.fb_db = fb_db || null;
    this.error = null;
  }
  
  get db()
  {
    return this.fb_db;
  }

  get last_error()
  {
    return this.error;
  }

  set last_error(e)
  {
    this.error = e;
    console.error(e);
  }
  
  // select =======================================================================================
  // where = [{field, op, value}]

  async Select_Value(table_name, field_name, where)
  {
    let res = null;

    const obj = await this.Select_Row(table_name, where);
    if (obj)
    {
      res = obj[field_name];
    }

    return res;
  }
  
  async Select_Value_By_Id(id, table_name, field_name)
  {
    let res = null;

    const obj = await this.Select_Row_By_Id(id, table_name);
    if (obj)
    {
      res = obj[field_name];
    }

    return res;
  }

  async Select_Obj(table_name, class_type, where)
  {
    let res = null;

    const obj = await this.Select_Row(table_name, where);
    if (obj)
    {
      res = this.To_Class(obj, class_type);
    }

    return res;
  }

  async Select_Objs_By_Ids(ids, table_name, class_type)
  {
    let objs = null;

    if (!Db_Firestore.Is_Empty(ids))
    {
      objs = [];
      for (const id of ids)
      {
        const obj = await this.Select_Obj_By_Id(id, table_name, class_type);
        objs.push(obj);
      }
    }

    return objs;
  }

  async Select_Obj_By_Id(id, table_name, class_type)
  {
    let res = null;

    const obj = await this.Select_Row_By_Id(id, table_name);
    if (obj)
    {
      res = this.To_Class(obj, class_type);
    }

    return res;
  }

  async Select_Objs(table_name, class_type, where, order_by, page)
  {
    let res = null;

    const objs = await this.Select(table_name, where, order_by, page);
    if (!Db_Firestore.Is_Empty(objs))
    {
      res = [];
      for (const obj of objs)
      {
        //const class_obj = new class_type(obj);
        const class_obj = await this.To_Class(obj, class_type);
        console.log("class_obj: ", class_obj);
        res.push(class_obj);
      }
    }

    return res;
  }

  async Select_Row(table_name, where)
  {
    let obj = null;

    const query_res = await this.Select_Query(table_name, where, 1)
    if (!query_res.empty)
    {
      const row = query_res.docs[0];
      obj = row.data();
      obj.id = row.id;
    }

    return obj;
  }

  async Select_Row_By_Id(id, table_name)
  {
    let obj = null;

    if (id)
    {
      const table = this.db.collection(table_name);
      const query = table.doc(id);
      const query_res = await query.get();
      if (query_res.exists)
      {
        obj = query_res.data();
        obj.id = query_res.id;
      }
    }

    return obj;
  }
  
  async Select_Values(field_name, table_name, where, order_by)
  {
    let res = null;

    const objs = await this.Select(table_name, where, order_by);
    if (!Db_Firestore.Is_Empty(objs))
    {
      res = [];
      for (const obj of objs)
      {
        res.push(obj[field_name]);
      }
    }

    return res;
  }

  async Select(table_name, where, order_by, page)
  {
    let res = null;

    const query_res = 
      await this.Select_Query(table_name, where, page?.limit, order_by, page?.start_at);
    if (query_res && !query_res.empty)
    {
      res = [];
      for (const row of query_res.docs)
      {
        const obj = row.data();
        obj.id = row.id;
        //console.log("obj: ", obj);
        res.push(obj);
      }
    }

    return res;
  }

  async Select_Query(table_name, where, limit, order_by, start_at)
  {
    let query_res = null;

    const table = this.db.collection(table_name);
    let query = this.Add_Where(table, where);
    query = this.Add_Order_By(query, order_by);
    query = (limit != null && limit != undefined) ? query.limit(limit): query;
    query = (start_at != null && start_at != undefined) ? query.startAt(start_at): query;

    try {query_res = await query.get();}
    catch (e) 
    {
      this.last_error = e;
      throw e;
    }

    return query_res;
  }

  // save, insert, update =========================================================================

  /**
   * Used to insert or update a single class based object in a particular table.
   * If the given object has an id, then the object will be updated.
   * If the given object has no id, then the object will be inserted.
   * @param {Object} class_obj - Object representing a row's worth of data
   * @param {string} table_name - Name of table into which to save data
   * @returns {Promise<string>} - String indicating the id of the saved object or null if failed
  **/
  Save(class_obj, table_name)
  {
    let res = null;

    if (class_obj.id)
    {
      res = this.Update(class_obj, table_name);
    }
    else
    {
      res = this.Insert(class_obj, table_name);
    }

    return res;
  }

  /**
   * Used to insert a single class based object in a particular table.
   * @param {Object} class_obj - Object representing a row's worth of data
   * @param {string} table_name - Name of table into which to insert data
   * @returns {Promise<string>} - String indicating the id of the inserted object or null if failed
  **/
  async Insert(class_obj, table_name)
  {
    const obj = this.To_Obj(class_obj);
    delete obj.id;

    class_obj.id = await this.Insert_Row(obj, table_name);
    const res = class_obj.id;

    return res;
  }

  /**
   * Used to insert a single row of data in a particular table.
   * @param {Object} data - Object representing a row's worth of data
   * @param {string} table_name - Name of table into which to insert data
   * @returns {Promise<string>} - String indicating the id of the inserted row or null if failed
  **/
  async Insert_Row(data, table_name)
  {
    const ids = await this.Insert_Rows([data], table_name);
    const res = !Utils.isEmpty(ids) ? ids[0] : null;

    return res;
  }

  /**
   * Used to insert rows of data in a particular table.
   * @param {Array} rows - Object array representing rows of data
   * @param {string} table_name - Name of table into which to insert data
   * @returns {Promise<string[]>} - String array indicating the ids of the inserted rows with nulls if failed
  **/
  async Insert_Rows(rows, table_name)
  {
    let res = null;

    if (!Utils.isEmpty(rows))
    {
      res = [];
      const table = this.db.collection(table_name);
      try 
      {
        for (const row of rows)
        {
          console.log("row: ", row);
          const doc_ref = await table.add(row);
          res.push(doc_ref.id);
        }
      }
      catch (e)
      {
        this.last_error = e;
      }
    }

    return res;
  }

  /**
   * Used to update a single class based object in a particular table.
   * @param {Object} class_obj - Object representing a row's worth of data
   * @param {string} table_name - Name of table in which to update data
   * @returns {Promise<string>} - String indicating the id of the updated object or null if failed
  **/
  async Update(class_obj, table_name)
  {
    let res = null;

    const obj = this.To_Obj(class_obj);
    const id = obj.id;
    delete obj.id;
    const table = this.db.collection(table_name);

    try 
    {
      await table.doc(id).set(obj);
      res = id;
    }
    catch (e)
    {
      this.last_error = e;
      console.error("Db_Firestore.Update(): Unable to update data.", e);
    }

    return res;
  }

  // delete =======================================================================================

  Delete(table_name, id)
  {
    return this.Delete_Ids(table_name, [id])
  }

  async Delete_Ids(table_name, ids)
  {
    let res = true;

    const table = this.db.collection(table_name);
    try
    {
      for (const id of ids)
      {
        await table.doc(id).delete();
      }
    }
    catch (e)
    {
      this.last_error = e;
      res = false;
    }

    return res;
  }

  async Delete_Objs(table_name, objs)
  {
    let res = true;

    if (!Utils.isEmpty(objs))
    {
      const ids = objs.map(o => o.id);
      res = await this.Delete_Ids(table_name, ids);
    }

    return res;
  }

  async Delete_Where(table_name, where)
  {
    let res = true;

    const rows = await this.Select(table_name, where);
    const table = this.db.collection(table_name);
    try
    {
      if (!Utils.isEmpty(rows))
      {
        for (const row of rows)
        {
          await table.doc(row.id).delete();
        }
      }
      else
      {
        this.last_error = "Delete_Where.NO_DATA";
        res = false;
      }
    }
    catch (e)
    {
      this.last_error = e;
      res = false;
    }

    return res;
  }

  // where, order by ==============================================================================

  Order_By(data, order_bys)
  {
    let res = data;

    if (!Db_Firestore.Is_Empty(data) && !Db_Firestore.Is_Empty(order_bys))
    {
      res = data.sort((a, b) => Compare(a, b, 0));

      function Compare(a, b, idx)
      {
        let res = 0;

        if (idx < order_bys.length)
        {
          const order_by = order_bys[idx];
          //console.log("Db_Firestore.Order_By(): order_by =", order_by);
          const compare_dir = order_by.dir == "asc" ? 1: -1;
          const value_a = a[order_by.field];
          const value_b = b[order_by.field];
          //console.log("Db_Firestore.Order_By(): value_a, value_b =", value_a, value_b);

          if (value_a == null || value_a == undefined) res = compare_dir;
          else if (value_b == null || value_b == undefined) res = -compare_dir;
          else if (value_a > value_b) res = compare_dir;
          else if (value_a < value_b) res = -compare_dir;
          else res = Compare(a, b, idx + 1);
        }

        return res;
      }
    }

    return res;
  }

  Add_Order_By(query, order_bys)
  {
    if (!Utils.isEmpty(order_bys))
    {
      for (const order_by of order_bys)
      {
        query = query.orderBy(order_by.field, order_by.dir);
      }
    }

    return query;
  }

  Where(data, wheres)
  {
    let res = data;

    if (!Db_Firestore.Is_Empty(data) && !Db_Firestore.Is_Empty(wheres))
    {
      for (const where of wheres)
      {
        if (where.op == "array-contains")
        {
          res = res.filter(o => this.Get_Field_Value(o, where, []).includes(where.value));
        }
        if (where.op == "contains")
        {
          res = res.filter(o => this.Get_Field_Value(o, where, "").includes(where.value));
        }
        if (where.op == "==")
        {
          res = res.filter(o => this.Get_Field_Value(o, where) == where.value);
        }
        if (where.op == ">=")
        {
          res = res.filter(o => this.Get_Field_Value(o, where) >= where.value);
        }
        if (where.op == "filter-fn")
        {
          res = res.filter(o => this.Get_Field_Value(o, where));
        }
      }
    }

    return res;
  }

  Get_Field_Value(obj, where, def_value)
  {
    let value = null;

    if (obj && where)
    {
      if (where.field_fn)
      {
        value = where.field_fn(obj);
      }
      else if (where.field)
      {
        value = obj[where.field];
      }
    }

    return value || def_value;
  }

  Add_Where(table, where_filters)
  {
    if (!Utils.isEmpty(where_filters))
    {
      for (const filter of where_filters)
      {
        table = table.where(filter.field, filter.op, filter.value);
      }
    }

    return table;
  }
  
  To_Db_Order_By(order_codes, order_bys)
  {
    let db_order_bys = null;

    if (!Utils.isEmpty(order_codes))
    {
      db_order_bys = [];

      for (const value of order_codes)
      {
        const order_code = value.code;
        const order_dir = value.dir == "desc" ? "desc": "asc";

        const order_by = order_bys.find(o => o.code == order_code);
        if (order_by)
        {
          const db_order_by = {field: order_by.field, dir: order_dir};
          db_order_bys.push(db_order_by);
        }
      }
    }

    return db_order_bys;
  }
  
  To_Db_Where(values, conditions, extra_filters)
  {
    let db_where = [];

    if (!Utils.isEmpty(values))
    {
      for (const value_name in values)
      {
        const condition = conditions.find(c => c.code == value_name);
        if (condition)
        {
          let value = values[value_name];
          if (value || (condition.use_null && value == null))
          {
            value = condition.map_fn ? condition.map_fn(value): value;

            const filter = 
            {
              field: condition.field, 
              field_fn: condition.field_fn, 
              op: condition.op, value
            };
            db_where.push(filter);
          }
        }
      }
    }

    if (!Utils.isEmpty(extra_filters))
    {
      db_where.push(...extra_filters);
    }

    return Utils.nullIfEmpty(db_where);
  }

  // misc =========================================================================================
  
  Start_Transaction()
  {
    return this.db.batch();
  }

  Commit()
  {
    return this.db.commit();
  }

  async Count(table_name, where)
  {
    let count = 0;

    const table = this.db.collection(table_name);
    let query = this.Add_Where(table, where);

    try 
    {
      const query_res = await query.count().get();
      count = query_res.data().count;
    }
    catch (e) 
    {
      this.last_error = e;
      throw e;
    }

    return count;
  }

  async Exists(table_name, id)
  {
    const table = this.db.collection(table_name);
    const query = table.doc(id);
    const query_res = await query.get();
    const res = query_res.exists;

    return res;
  }

  To_Obj(class_obj)
  {
    return class_obj.To_Db_Obj ? class_obj.To_Db_Obj(class_obj) : Utils.To_Obj(class_obj);
  }

  To_Class(db_obj, class_type)
  {
    let class_obj = null;

    if (class_type.To_Class_Obj)
    {
      class_obj = class_type.To_Class_Obj(db_obj);
    }
    else
    {
      //class_obj = new class_type(db_obj);
      class_obj = new class_type();
      Object.assign(class_obj, db_obj);
    }

    return class_obj;
  }

  static Is_Empty(items)
  {
    let res = false;

    if (items == null || items == undefined)
    {
      res = true;
    }
    else if (Array.isArray(items))
    {
      if (items.length == 0)
      {
        res = true;
      }
    }
    else if (typeof items == "string")
    {
      const str = items.trim();
      if (str.length == 0 || str == "")
      {
        res = true;
      }
    }
    else if (items.length == 0)
    {
      res = true;
    }

    return res;
  }

  static async To_JSON(db, table_name)
  {
    /*let res = null;

    const objs = await db.Select(table_name);
    if (!Db_Firestore.Is_Empty(objs))
    {
      res = JSON.stringify(objs, null, 2);
    }

    return res;*/
    return db.Select(table_name);
  }
}

export default Db_Firestore;
