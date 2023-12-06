import Utils from "../lib/Utils.js";

class DE_Select extends HTMLElement
{
  static tname = "de-select";

  constructor()
  {
    super();
    this.items = null;
    this.item_value = null;
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  // public fields ================================================================================

  get value()
  {
    return this?.select?.value;
  }

  set value(v)
  {
    this.item_value = v;
    if (this.isConnected)
    {
      this.Render_Value();
    }
  }

  set options(items)
  {
    if (!Utils.isEmpty(items))
    {
      if (this.hasAttribute("no-dups"))
      {
        const unique_items = [];
        for (const item of items)
        {
          if (!unique_items.find(i => i.value == item.value))
          {
            unique_items.push(item);
          }
        }
        items = unique_items;
      }

      if (this.hasAttribute("do-sort"))
      {
        items.sort((a, b) => (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0));
      }

      this.items = items;
    }

    if (this.isConnected)
    {
      this.Render_Items();
    }
  }

  // public methods ===============================================================================

  // events =======================================================================================

  // rendering ====================================================================================

  Render_Value()
  {
    this.select.value = this.item_value;
  }

  Render_Null()
  {
    if (this.hasAttribute("with-null"))
    {
      const null_option = document.createElement('option');
      this.select.append(null_option);
    }
  }

  Render_Items()
  {
    this.select.replaceChildren();
    if (!Utils.isEmpty(this.items))
    {
      this.Render_Null();
      for (const item of this.items)
      {
        const option = document.createElement('option');
        option.innerText = item.text;
        option.value = item.value;
        this.select.append(option);
      }
    }
  }

  Render()
  {
    //const children = [...this.children];
    this.innerHTML = `
      <select cid="select"></select>
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.Render_Items();
    this.Render_Value();
    //this.After_Render(children);
  }

  After_Render(children)
  {
    this.select.addEventListener("focus", this.On_Focus);
    this.select.addEventListener("blur", this.On_Blur);
    if (!Utils.isEmpty(children))
    {
      this.select.replaceChildren(...children);
      if (Utils.hasValue(this.select.value))
      {
        this.On_Add_Focus();
      }
    }
  }
}

Utils.Register_Element(DE_Select);

export default DE_Select;
