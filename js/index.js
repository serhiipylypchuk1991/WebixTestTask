
webix.ready(function(){

  var dashboard_data_link = "./data/data.js";
  var users_data_link = "./data/users.js";
  var products_data_link = "./data/products.js";

  var topbar = {
    view:"toolbar",
    css:"webix_dark",
    elements:[
      {view: "label", label:"My App"},
      {
         view:"button",
         id:"btn_profile",
         type:"icon",
         icon:"wxi-user",
         label:"Profile",
         css:"webix_transparent",
         width:100,
         popup:"profile_popup"
      }
    ]
  };
  var side = {
    type:"clean",
    width:300,
    minWidth:250,
    rows:[
      {
        view:"list",
        id:"side_menu_list",
        scroll:false,
        css:"GrayBackground",
        select:true,
        on:{
          onAfterSelect:function(id){
            $$(id).show();
          }
        },
        data:[ "Dashboard", "Users", "Products", "Admin"]
      },
      {
        template:"<span class='webix_icon mdi mdi-check'></span><span>Connected</span>",
        css:"GrayBackground GreenText TextAlign",
        height:30,
        width:350
      }
    ]
  };
  var data = {
    view:"datatable",
    id:"films_datatable",
    scrollY:true,
    autoConfig:true,
    minWidth:400,
    url:dashboard_data_link
  };
  var form = {
      view:"form",
      id:"films_form",
      width:350,
      elements:[
        {
          margin:10,
          rows:[
            {template:"EDIT FILMS", type:"section"},
            {view:"text", label:"Title", name:"title", invalidMessage:"Enter Title of Film"},
            {view:"text", label:"Year", name:"year", invalidMessage:"Enter Year between 1970 and 2021"},
            {view:"text", label:"Rating", name:"rating", invalidMessage:"Enter Raiting between 1 and 10"},
            {view:"text", label:"Votes", name:"votes", invalidMessage:"Enter Votes between 0 and 99999"},
          ]
        },
        {
          margin:20,
          cols:[
            {view:"button", id:"btn_add_new", value:"Add new", css:"webix_primary",
              click:function(){
                if($$("films_form").validate()){
                    var item = $$("films_form").getValues();

                    item.rank = $$("films_datatable").count()+1;//add correct rank to item object (temporary decision)

                    $$("films_datatable").add(item);
                    $$("films_form").clear();

                    webix.message({
                      text:"Data has added successfully",
                      type:"success",
                      expire:3000
                    });
                }else{
                    webix.message({
                      text:"Please, fill the correct data in the fields of the form",
                      type:"error",
                      expire:3000
                    });
                }
              }
            },
            {view:"button", id:"btn_clear", value:"Clear", css:"webix_secondary",
              click:function(){

                $$("films_form").validate();

                webix.confirm({
                  title:"Form data would be cleared",
                  text:"Do you still want to continue?"
                }).then(
                  function(){
                    //webix.message("Confirmed");
                    $$("films_form").clear();
                    $$("films_form").clearValidation();
                  },
                  function(){
                    //webix.message("Rejected");
                  }
                );
              }
            },
          ]
        },{},{}
      ],
      rules:{//ruls for validation
        title:webix.rules.isNotEmpty,
        year:function(value){
          return (value >= 1970 && value <= 2021);
        },
        rating:function(value){
          return (value > 0 && value <= 10);
        },
        votes:function(value){
          if(value == 0 || (value > 0 && value < 100000)){
            return value;
          }else{return false}
        }
      }
      /*onValidationError:function(key, data){
        webix.message.position = "bottom";
        webix.message({text:key.toUpperCase()+"  field is incorrect", type:"error"});
      }*/
    };
  var main = {
    cells:[
    	{ id:"Dashboard", cols:[data,form]},
      { id:"Users", template:"Users View"},
      { id:"Products", template:"Products View"},
      { id:"Admin", template:"Admin View"}
    ]
  };
  var bottombar = {
    template:"The software is provided by <a href='https://webix.com'>https://webix.com</a>. All rights reserved &#169;",
    css:"TextAlign",
    height:30,
    width:550
  };

  webix.ui({
    view:"popup",
    id:"profile_popup",
    body:{
      view:"list",
      template:"#title#",
      autoheight:true,
      autowidth:true,
      data:[
        {id:1, title:"Settings"},
        {id:2, title:"Log Out"}
      ]
    }
  });

  webix.ui({
    id:"app",
    rows:[
      topbar,
      {cols:[side, {view:"resizer"}, main]},
      bottombar
    ]
  });

  $$("side_menu_list").select("Dashboard"); //selected by default
});
