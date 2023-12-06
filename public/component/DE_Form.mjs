import Utils from "../lib/Utils.js";

class DE_Form extends HTMLElement 
{
  static tname = "de-form";

  Clr_Input()
  {
    const elems = this.querySelectorAll("[name]");
    if (!Utils.isEmpty(elems))
    {
      for (const elem of elems)
      {
        elem.value = null;
      }
    }
  }

  get value()
  {
    let res = null;

    const elems = this.querySelectorAll("[name]");
    if (!Utils.isEmpty(elems))
    {
      res = {};
      for (const elem of elems)
      {
        const name = elem.getAttribute("name");
        const value = elem.value;
        if (Utils.isEmpty(value))
        {
          res[name] = null;
        }
        else if (elem.type == "number")
        {
          res[name] = elem.valueAsNumber;
        }
        else if (elem.type == "datetime-local")
        {
          const offset = (new Date()).getTimezoneOffset()*60*1000;
          res[name] = elem.valueAsNumber + offset;
        }
        else if (elem.type == "checkbox")
        {
          res[name] = elem.checked;
        }
        else
        {
          res[name] = value;
        }
      }
    }

    return res;
  }

  set value(data)
  {
    const elems = this.querySelectorAll("[name]");
    if (!Utils.isEmpty(elems))
    {
      for (const elem of elems)
      {
        const name = elem.getAttribute("name");
        const value = data[name];
        if (elem.type == "checkbox")
        {
          elem.checked = value;
        }
        else if (value == undefined)
        {
          elem.value = null;
        }
        else if (elem.type == "datetime-local")
        {
          const offset = (new Date()).getTimezoneOffset()*60*1000;
          elem.valueAsNumber = value - offset;
        }
        else
        {
          elem.value = value;
        }
      }
    }
  }

  // rendering ==========================================================================

}

Utils.Register_Element(DE_Form);

export default DE_Form;