import Utils from "../lib/Utils.js";
//import '/__/firebase/9.4.0/firebase-app-compat.js';
//import '/__/firebase/9.4.0/firebase-auth-compat.js';
//import '/__/firebase/init.js?useEmulator=true';
//import MB_Dlg_Btn from "/node_modules/menu-buddy/MB_Dlg_Btn.mjs";

class DE_Header extends HTMLElement 
{
  static tname = "de-header";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  set subtitle(value)
  {
    if (!Utils.isEmpty(value))
    {
      this.subtitle_elem.innerText = "- " + value;
    }
    else
    {
      this.subtitle_elem.innerText = "";
    }
  }

  get frame()
  {
    let frame_elem = null;

    if (this.hasAttribute("frame-id"))
    {
      const frame_id = this.getAttribute("frame-id");
      frame_elem = document.getElementById(frame_id);
    }

    return frame_elem;
  }

  // events =============================================================================

  async On_Click_Sign_Out()
  {
    await firebase.auth().signOut();
    window.open("/index.html", "_self");
  }

  On_Click_View_Queries()
  {
    this.frame.src = "/pages/queries.html";
  }

  On_Click_View_Blog()
  {
    this.frame.src = "/pages/blog.html";
  }

  On_Click_View_Data()
  {
    this.frame.src = "/pages/trends.html";
  }

  On_Click_View_Charts()
  {
    this.frame.src = "/pages/charts.html";
  }

  On_Click_Dashboard()
  {
    this.frame.src = "/pages/dashboard.html";
  }

  On_Click_View_Sign_In()
  {
    window.open("/index.html", "_self");
  }

  On_Click_About()
  {
    this.frame.src = "/pages/blog/blog1.html";
  }

  // rendering ==========================================================================

  Render()
  {
    this.innerHTML = `
      <div>
        <mb-dlg-btn cid="menu_elem"></mb-dlg-btn>
        Project X <span cid="subtitle_elem"></span>
      </div>
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    /*const menu_options =
    [
      { id: 1, title: "Dashboard", click: this.On_Click_Dashboard},
      { id: 2, title: "Queries", click: this.On_Click_View_Queries},
      { id: 3, title: "Data", click: this.On_Click_View_Data},
      { id: 4, title: "Charts", click: this.On_Click_View_Charts},
      { id: 5, title: "Blog", click: this.On_Click_View_Blog},
      { id: 6, title: "About", click: this.On_Click_About},
      { id: 7, title: "Game", click: () => this.frame.src = "/pages/game.html"},
      { id: 8, title: "Sign In", click: this.On_Click_View_Sign_In},
      { id: 9, title: "Sign Out", click: this.On_Click_Sign_Out},
    ];
    this.menu_elem.options_flat = menu_options;*/
  }
}

Utils.Register_Element(DE_Header);

export default DE_Header;