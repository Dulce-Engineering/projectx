import Utils from "../lib/Utils.js";
import "../component/DE_Form.mjs";

class DE_Form_Dlg extends HTMLElement 
{
  static tname = "de-form-dlg";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  // Fields =============================================================================

  get value()
  {
    return this.form?.value;
  }

  set value(obj)
  {
    this.form.value = obj;
  }

  // Events =============================================================================

  On_New()
  {
    this.form.Clr_Input();
    this.dlg.showModal();
  }

  On_Edit(obj)
  {
    this.form.value = obj;
    this.dlg.showModal();
  }

  On_Click_Save()
  {
    this.dlg.close();
    this.dispatchEvent(new Event("save"));
  }

  // rendering ==========================================================================

  Render()
  {
    const form_inputs = [...this.children];

    const html = `
      <dialog cid="dlg">
        <header cid="hdr"></header>
        <de-form cid="form">
        </de-form>
        <footer>
          <button cid="save_btn">Save</button>
          <button cid="cancel_btn">Cancel</button>
        </footer>
      </dialog>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    if (this.hasAttribute("title-text"))
    {
      const title_text = this.getAttribute("title-text");
      this.hdr.innerText = title_text;
    }

    if (this.hasAttribute("ok-text"))
    {
      const ok_text = this.getAttribute("ok-text");
      this.save_btn.innerText = ok_text;
    }
    this.form.append(...form_inputs);

    this.hdr.addEventListener("click", () => this.dlg.close());
    this.cancel_btn.addEventListener("click", () => this.dlg.close());
    this.save_btn.addEventListener("click", this.On_Click_Save);
  }
}

Utils.Register_Element(DE_Form_Dlg);

export default DE_Form_Dlg;