import Utils from "../lib/Utils.js";

class DE_Table extends HTMLElement 
{
  static tname = "de-table";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  set value(objs)
  {
    this.body.replaceChildren();
    for (const obj of objs)
    {
      const body_row = document.createElement("tr");
      this.body.append(body_row);

      const cols = this.head_row.querySelectorAll("th[name]");
      for (const th of cols)
      {
        const row_cell = document.createElement("td");
        body_row.append(row_cell);

        this.Render_Cell(row_cell, th, obj);
      }
    }
  }

  connectedCallback()
  {
    this.Render();
  }

  Copy_Attr(name, src, dst)
  {
    if (src.hasAttribute(name))
    {
      const src_value = src.getAttribute(name);
      dst.setAttribute(name, src_value);
    }
  }

  Reload()
  {

  }

  Render()
  {
    const cols = [...this.children];
    this.innerHTML = `
      <table>
        <thead>
          <tr cid="head_row"></tr>
        </thead>
        <tbody cid="body">
        </tbody>
        <tfoot>
          <tr></tr>
        </tfoot>
      </table>
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.Render_Head_Row(cols);
  }

  Render_Head_Row(cols)
  {
    for (const col of cols)
    {
      const th = document.createElement("th");
      this.head_row.append(th);

      th.append(...col.childNodes);
      this.Copy_Attr("name", col, th);
      this.Copy_Attr("has-label", col, th);
    }
  }

  Render_Cell(cell, th, obj)
  {
    if (th.hasAttribute("has-label"))
    {
      const label_text = th.innerText;
      const label = document.createElement("label");
      label.innerText = label_text;
      cell.append(label);
    }

    const field_name = th.getAttribute("name");
    const field_value = obj[field_name];
    cell.append(field_value);
  }
}

Utils.Register_Element(DE_Table);

export default DE_Table;
