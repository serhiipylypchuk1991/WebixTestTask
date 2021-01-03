
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
  var sidebar = {
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
        view:"label",
        label: "<span class='green_text webix_icon mdi mdi-check'></span><span class='green_text'>Connected</span>",
        align:"center",
        height:40,
        css:"gray_background",
      }
    ]
  };
  var data = {
    view:"datatable",
    id:"films_datatable",
    scrollY:true,
    minWidth:400,
    columns:[
      { id:"rank", header:"", width:50, css:"rank", sort:"int"},
      { id:"title", header:["Film title",{ content:"textFilter"}], fillspace:true, sort:"text"},
      { id:"year", header:["Year",{ content:"textFilter"}], width:80, sort:"int"},
      { id:"rating", header:["Rating",{ content:"selectFilter"}], width:80, sort:"int"},//sort of Rating doesn't work correctly!!!
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
  var list = {
    type:"clean",
    rows:[
      {
        height: 35,
        view:"toolbar",
        elements:[
          {
            view:"text",
            id:"list_input",
            on:{
              onTimedKeyPress:function(){
                var value = this.getValue().toLowerCase();
                $$("list").filter(function(obj){
                    return obj.name.toLowerCase().indexOf(value)==0;
                })
              }
            },
          },
          {view:"button", id:"btn_sort_asc", value:"Sort asc", css:"webix_primary", width:120,
            click:function(){
              webix.message({text:"Sort asc", expire:350});
              $$("list").sort("#name#","asc","string");
            }
          },
          {view:"button", id:"btn_sort_desc", value:"Sort desc", css:"webix_primary", width:120,
            click:function(){
              webix.message({text:"Sort desc", expire:350});
              $$("list").sort("#name#","desc","string");
            }
          }
        ]
      },
      {
        view:"list",
        css:"user_list",
        id:"list",
        height:300,
        scrollY:true,
        scrollX:false,
        select:true,
        template:"#name# <span class='remove_list_item_btn webix_icon mdi mdi-close'></span>",
        onClick:{
          remove_list_item_btn:function(e, id){
            this.remove(id);
            return false;
          }
        },
        url:users_data_link
      }
    ]
  };
  var chart = {
    type:"clean",
    rows:[
      {
        view:"chart",
        type:"bar",
        value:"#age#",
        label:"#age#",
        minHeight:300,
        tooltip:"User: #name#",
        border:true,
        barWidth:40,
        radius:1,
        xAxis:{
            template:"#age#"
        },
        gradient:"falling",
        url:users_data_link
      },
      {
        view:"label",
        label: "<span class='gray_text'>Age</span>",
        align:"center",
        height:30
      }
    ]
  };
  var treetable = {
    view:"treetable",
    scrollY:true,
    scrollX:false,
    select:true,
    columns:[
      { id:"id", header:"", css:"treetable_id", width:50},
      { id:"title",	header:"Title", css:"treetable_title", minWidth:300, template:"{common.treetable()} #title#"},
      { id:"price",	header:"Price", minWidth:300, css:"treetable_price", fillspace:true}
    ],
    url:products_data_link
  };
  var main = {
    cells:[
    	{ id:"Dashboard", cols:[data,form]},
      { id:"Users", rows:[list,chart]},
      { id:"Products", rows:[treetable]},
      { id:"Admin", template:"Admin View"}
    ]
  };
  var bottombar = {
    rows:[
      { view:"template", height:0.1 },
      {
        view:"label",
        label: "<span class='gray_text'>The software is provided by <a href='https://webix.com'>https://webix.com</a>. All rights reserved &#169;</span>",
        align:"center",
        height:42
      }
    ]
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
      {
        cols:[
          sidebar,
          {view:"resizer"},
          main
        ]
      },
      bottombar
    ]
  });

  $$("side_menu_list").select("Dashboard"); //selected by default

});
