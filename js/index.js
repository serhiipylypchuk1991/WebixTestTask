webix.ready(function(){
//Links and Data!!!
  var dashboard_data_link = "./data/data.js";
  var users_data_link = "./data/users.js";
  var products_data_link = "./data/products.js";
  var categories_data_link = "./data/categories.js";

  var countries_data = new webix.DataCollection({
    url:"./data/countries.js"
  });//Load data from js file

//Components!!!
  var topbar = {
    view:"toolbar",
    css:"webix_dark",
    elements:[
      {view: "label", label:"My App"},
      {
         view:"button",
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
    select:true,
    scrollY:true,
    minWidth:400,
    scheme:{
        $init:function(obj){
            obj.categoryId = getRandomInt(1,4);
            obj.rank = this.count();//Like variant
            //obj.rank = datatable.data.order.length;//Like variant
            //obj.rank = Number(obj.rank);
            obj.votes = Number(obj.votes.replace(",", "."));
            obj.rating = Number(obj.rating.replace(",", "."));
            obj.year = Number(obj.year);
        }
    },
    columns:[
      { id:"rank", header:"#", width:50, css:"rank", sort:"int"},
      { id:"title", header:["Film title",{ content:"textFilter"}], fillspace:true, sort:"text"},
      { id:"categoryId", collection:categories_data_link, header:["Category",{ content:"selectFilter"}], sort:"text",},
      { id:"rating", header:["Rating",{ content:"textFilter"}], width:80, sort:"int"},
      { id:"votes", header:["Votes",{ content:"textFilter"}], width:80, sort:"int"},
      { id:"year", header:"Year", width:80, sort:"int"},
      { id:"del", header:"", template:"{common.trashIcon()}", width:60}
    ],
    hover:"datatable_hover",
    onClick:{
      "wxi-trash":function(e, id){

        webix.confirm({
          title:"Film data would be deleted",
          text:"Do you still want to continue?",
          type:"confirm-warning"
        }).then(() => {

            webix.message({
              text:"Element was deleted",
              type:"info"
            });

            this.remove(id);
            return false;
          },
          function(){
             webix.message("Rejected");
          }
        );
      }
    },
    url:dashboard_data_link
  };

  //Like a variant of tab Filtering
  var segmented_tab ={
      view:"segmented", id:"selector", inputWidth:500,
      options:[
        {id:1, value:"All"},//All
        {id:2, value:"Old"},//<=2000
        {id:3, value:"Modern"},//>2000 && <=2005
        {id:4, value:"New"}//>2005
      ],
      on:{
        onChange:function(){
          datatable.filterByAll();
        }
      }
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
            {view:"button", value:"Save", css:"webix_primary",
              click:function(){

                if(films_form.validate()){
                    var item_data = films_form.getValues();
                    if(item_data.id){

                      films_form.save();
                      datatable.unselectAll();

                      webix.message({
                        text:"Data has edited successfully",
                        type:"success",
                        expire:3000
                      });

                    } else {
                      films_form.save();

                      //custom version how to select and show new added element after .save()
                      scrollToLastAddedElement(datatable,true,false);

                      webix.message({
                        text:"Data has added successfully",
                        type:"success",
                        expire:3000
                      });

                    }
                    films_form.clear();
                }else{

                    webix.message({
                      text:"Please, enter the correct data in the fields of the form",
                      type:"error",
                      expire:3000
                    });

                }
              }
            },
            {view:"button", value:"Clear", css:"webix_secondary",
              click:function(){
                films_form.validate();
                webix.confirm({
                  title:"Form would be cleared",
                  text:"Do you still want to continue?",
                  type:"confirm-warning"
                }).then(
                  function(){
                    films_form.clear();
                    films_form.clearValidation();
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
          return (value.replace(",", ".") > 0 && value.replace(",", ".") <= 10);
        },
        votes:function(value){
          if(value == 0 || (value.replace(",", ".") > 0 && value.replace(",", ".") < 100000)){
            return value;
          }else{return false}
        }
      }
    };

  //For list editing ability
  webix.protoUI({
    name:"editlist"
  }, webix.EditAbility, webix.ui.list);

  var list = {
    view:"editlist",
    id:"users_list",
    scheme:{
      $init:function(obj){
        if(obj.age < 26){
          obj.$css = "young_users";
        }
      }
    },
    editable:true,
    editor:"text",
    editValue:"name",
    template:"#name#, #age#, <span> from </span>#country#",
    height:300,
    scrollY:true,
    scrollX:false,
    select:true,
    rules:{
      name:webix.rules.isNotEmpty
    },
    onClick:{
      remove_list_item_btn:function(e, id){
        this.remove(id);
        return false;
      }
    },
    url:users_data_link
  };
  var list_toolbar = {
    height: 35,
    view:"toolbar",
    elements:[
      {
        view:"text",
        id:"list_input",
        on:{
          onTimedKeyPress:function(){
            var value = this.getValue().toLowerCase();
            users_list.filter(function(obj){
                return obj.name.toLowerCase().indexOf(value) !== -1;
            });
          }
        }
      },
      {view:"button", value:"Sort asc", css:"webix_primary", width:120,
        click:function(){
          webix.message({text:"Sort asc", expire:350});
          users_list.sort("#name#","asc","string");
        }
      },
      {view:"button", value:"Sort desc", css:"webix_primary", width:120,
        click:function(){
          webix.message({text:"Sort desc", expire:350});
          users_list.sort("#name#","desc","string");
        }
      },
      {view:"button", value:"Add new", css:"webix_primary", width:120,
        click:function(){
          webix.message({text:"New user was added", expire:350});

          users_list.add({name:"John Smit", age:getRandomInt(18,60), country:countries_data.data.pull[getRandomInt(1,8)]["value"]});

          //custom version how to select and show new added element
          scrollToLastAddedElement(users_list,true,true);
        }
      }
    ]
  };
  var chart = {
    view:"chart",
    id:"users_chart",
    type:"bar",
    value:"#age#",
    minHeight:300,
    barWidth:40,
    radius:1,
    xAxis:{
      template:"#country#",
      title:"Country"
    },
    yAxis:{
      start:0,
      end:10,
      step:2
    }
  };
  var treetable = {
    view:"treetable",
    //id:"tree",
    scheme:{
      $init:function(obj){
        obj.open = true;
      }
    },
    scrollY:true,
    scrollX:false,
    select:true,
    columns:[
      { id:"id", header:"", css:"treetable_id", width:50},
      { id:"title",	header:"Title", editor:"text", css:"treetable_title", minWidth:300, liveEdit:true, template:"{common.treetable()} #title#"},
      { id:"price",	header:"Price", editor:"text", minWidth:300, css:"treetable_price", liveEdit:true, fillspace:true}
    ],
    on:{
      onLiveEdit:function(state, editor){
        if(editor.column === "price"){
          if (!(state.value > 0 && state.value <= 100) || !webix.rules.isNumber(state.value)){
            this.addRowCss(editor.row, "treetable_edit_ruls");
          }else{
            this.removeRowCss(editor.row, "treetable_edit_ruls");
          }
        }else if(editor.column === "title"){//can use just else
          if (!titleValidation(state.value,20)){
            this.addRowCss(editor.row, "treetable_edit_ruls");
          }else{
            this.removeRowCss(editor.row, "treetable_edit_ruls");
          }
        }
      }
    },
    editable:true,
    rules:{
      title:function(value){
        return  titleValidation(value,20);
      },
      price:function(value){
        return (value > 0 && value <= 100 && webix.rules.isNumber(value));
      }
    },
    url:products_data_link
  };

  var main = {
    cells:[
    	{ id:"Dashboard",cols:[{rows:[segmented_tab,data]},form]},
      { id:"Users", rows:[list_toolbar,list,chart]},
      { id:"Products", rows:[treetable]},
      { id:"Admin", template:"Admin View"}
    ]
  };
  var bottombar = {
    view:"label",
    label: "<span class='gray_text'>The software is provided by <a href='https://webix.com'>https://webix.com</a>. All rights reserved &#169;</span>",
    align:"center",
    height:42
  };

  //popup for profile button
  webix.ui({
    view:"popup",
    id:"profile_popup",
    body:{
      view:"list",
      autoheight:true,
      template:"#title#",
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

//Component links
  var datatable = $$("films_datatable");
  var films_form = $$("films_form");
  var users_list = $$("users_list");
  var users_chart = $$("users_chart");

//Binding components
  films_form.bind(datatable);

//Custom functions
  //return number in range between min and max value
  function getRandomInt(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random()*(max-min+1))+min;
  }

  //scroll to last added element of list or datatable
  function scrollToLastAddedElement(component,show,select){
    var data_obj = component.data.pull;
    var last_id = Object.keys(data_obj)[Object.keys(data_obj).length-1];
      if(last_id){
        if(show === true && select === true){
          component.showItem(last_id);
          component.select(last_id);
        }else{
          component.showItem(last_id);
        }
      }else{console.log("Incorrect last_id");}
  }

  //title validation function
  function titleValidation(value,rightLength){
		var regExpResolt = value.search(/[\§\<\>@#\$\^&\*\+=\\~\[\]\{\}\|_]/g),
			  argLength = value.length;
		if(regExpResolt === -1 && argLength >= 1 && argLength <= rightLength){
			return value;
		}else{
      return false;
    }
	}

  //sync from list to chart
  users_chart.sync(
    users_list,
    function(){
      users_chart.group({
        	by:"country",
        	map:{
            age:[ "country","count"]
          }
      });
    }
  );

  $$("side_menu_list").select("Dashboard"); //selected tab element by default

  //filter for tab datatable filtering of years
  datatable.registerFilter(
    $$("selector"),
    { columnId:"year", compare:function(value, filter, item){
      //console.log(filter);
      if(filter == 1){
        return value;
      }else if(filter == 2){
        return value <= 2000;
      }else if(filter == 3) {
        return value > 2000 && value <= 2005;
      }else return value > 2005;
    }},
    {
      getValue:function(node){
        return node.getValue();
      },
      setValue:function(node, value){
        node.setValue(value);
      }
    }
  );

});
