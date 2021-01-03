
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
    maxWidth:350,
    rows:[
      {
        view:"list",
        id:"side_menu_list",
        scroll:false,
        css:"gray_background",
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
        css:"gray_background green_text text_align",
        height:30,
        width:350
      }
    ]
  };
  var data = {
    view:"datatable",
    id:"films_datatable",
    scrollY:true,
    minWidth:400,
    columns:[
      { id:"rank", header:"", width:50, css:"rank", sort:"int", border:true},
      { id:"title", header:["Film title",{ content:"textFilter"}], fillspace:true, sort:"text"},
      { id:"year", header:["Year",{ content:"textFilter"}], width:80, sort:"int"},
      { id:"rating", header:["Rating",{ content:"selectFilter"}], width:70, sort:"int"},
      { id:"votes", header:["Votes",{ content:"textFilter"}], width:80, sort:"int" //sort of Votes doesn't work correctly!!!
        //template:(obj)=>{return `${obj.votes.replace(",", ".")}`}
      },
      { id:"edit",header:"", template:"{common.editIcon()}", width:60},
      { id:"del", header:"", template:"{common.trashIcon()}", width:60}
    ],
    hover:"datatable_hover",
    onClick:{
      "wxi-trash":function(e, id){
        var self=this;
        webix.confirm({
          title:"Film data would be deleted",
          text:"Do you still want to continue?",
          type:"confirm-warning"
        }).then(
          function(){

            webix.message({
              text:"Element was deleted",
              type:"info"
            });

    	      self.remove(id);
        	  return false;
          },
          function(){
             webix.message("Rejected");
          }
        );
      },
      "wxi-pencil":function(e, id){
        var self=this;
        webix.confirm({
          title:"Film data would be edited",
          text:"Do you still want to continue?",
          type:"confirm-warning"
        }).then(
          function(){

            webix.message({
              text:"Element data is already in form",
              type:"info"
            });

            var values = self.getItem(id);
            $$("films_form").setValues(values);
          },
          function(){
             webix.message("Rejected");
          }
        );
      }
    },
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
            {view:"button", id:"btn_save", value:"Save", css:"webix_primary",
              click:function(){
                if($$("films_form").validate()){
                    var datatable = $$("films_datatable");
                    var item_data = $$("films_form").getValues();

                    if (item_data.id){
                      datatable.updateItem(item_data.id, item_data);

                      webix.message({
                        text:"Data has edited successfully",
                        type:"success",
                        expire:3000
                      });

                    } else {
                      item_data.rank = datatable.count()+1;//add correct rank to item object (temporary decision)
                      datatable.add(item_data);

                      webix.message({
                        text:"Data has added successfully",
                        type:"success",
                        expire:3000
                      });

                    }
                    $$("films_form").clear();
                }else{

                    webix.message({
                      text:"Please, enter the correct data in the fields of the form",
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
                  title:"Form would be cleared",
                  text:"Do you still want to continue?",
                  type:"confirm-warning"
                }).then(
                  function(){
                    $$("films_form").clear();
                    $$("films_form").clearValidation();
                  },
                  function(){
                    webix.message("Rejected");
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
          //console.log(value.replace(",", ".")); //for correct validation of float type
          return (value.replace(",", ".") > 0 && value.replace(",", ".") <= 10);
        },
        votes:function(value){
          if(value == 0 || (value.replace(",", ".") > 0 && value.replace(",", ".") < 100000)){
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
    css:"text_align",
    height:30,
    width:550
  };

  //popup for profile
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

  //main webix
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
