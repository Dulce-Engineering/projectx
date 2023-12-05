import Utils from "../lib/Utils.js";

class Input_Span extends HTMLElement 
{
  static tname = "input-span";

  constructor()
  {
    super();
    this.name = null;
    this.v = null;
  }

  connectedCallback()
  {
    this.Render();
  }

  static observedAttributes = ["value", "name"];
  attributeChangedCallback(attr_name, old_value, new_value)
  {
    if (attr_name == "value")
    {
      this.v = new_value;
    }
    else if (attr_name == "name")
    {
      this.name = new_value;
    }
  }

  set value(v)
  {
    this.v = v;
    this.Render();
  }

  get value()
  {
    return this.v;
  }

  // rendering ==========================================================================

  Render()
  {
    if (this.v == null && this.hasAttribute("placeholder"))
    {
      this.innerText = this.getAttribute("placeholder");
    }
    else
    {
      this.innerText = this.v;
    }
  }
}

Utils.Register_Element(Input_Span);

export default Input_Span;