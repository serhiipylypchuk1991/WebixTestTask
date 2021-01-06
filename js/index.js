
webix.ready(function(){

  var grid_data = [
    {id:1, title:"The Shawshank Redemption", year:1994, votes:678790, rating:9.2, rank:1},
    {id:2, title:"The Godfather", year:1972, votes:511495, rating:9.2, rank:2},
    {id:3, title:"The Godfather: Part II", year:1974, votes:319352, rating:9.0, rank:3},
    {id:4, title:"The Good, the Bad and the Ugly", year:1966, votes:213030, rating:8.9, rank:4},
    {id:5, title:"My Fair Lady", year:1964, votes:533848, rating:8.9, rank:5},
    {id:6, title:"12 Angry Men", year:1957, votes:164558, rating:8.9, rank:6}
  ];

  webix.ui({

    view:"popup",
    id:"profile_popup",
    body:{
      view:"list",
      template:"#title#",
      autoheight:true,
      data:[
        {id:1, title:"Settings"},
        {id:2, title:"Log Out"}
      ]
    }
  });

  webix.ui({
    rows:[
        {
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
               width:100
            }
          ]
        },
        {
          cols:[
            {
              type:"clean",
              width:300,
              minWidth:250,
              rows:[
                {
                  view:"list",
                  scroll:false,
                  css:"GrayBackground",
                  template:"#title#",
                  data:[
                    {id:1, title:"Dashboard"},
                    {id:2, title:"Users"},
                    {id:3, title:"Products"},
                    {id:4, title:"Locations"}
                  ]
                },
                {
                  template:"<span class='webix_icon mdi mdi-check'></span><span>Connected</span>",
                  css:"GrayBackground GreenText TextAlign",
                  height:30,
                  width:350
                }
              ]
            },
            {view:"resizer"},
            {
              view:"datatable",
              scrollY:true,
              autoConfig:true,
              minWidth:400,
              data:grid_data
            },
            {
              view:"form",
              width:250,
              elements:[
                {
                  margin:10,//margin for all elements of rows[]
                  rows:[
                    {template:"EDIT FILMS", type:"section"},
                    {view:"text", label:"Title"},
                    {view:"text", label:"Year"},
                    {view:"text", label:"Rating"},
                    {view:"text", label:"Votes"},
                  ]
                },
                {
                  margin:20,
                  cols:[

                    {view:"button", value:"Add new", css:"webix_primary",
                      click:function(){
                        if(films_form.validate()){
                            var item = films_form.getValues();
                            var datatable = $$("films_datatable");
                            item.rank = grid_data.length+1;//add correct rank to item object
                            grid_data.push(item);//add item object to the grid_data array

                            datatable.add(item);
                            datatable.showItem(item.id);
                            datatable.select(item.id);

                            films_form.clear();

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
                    {view:"button", value:"Clear", css:"webix_secondary",
                      click:function(){

                        films_form.validate();

                        webix.confirm({
                          title:"Form data would be cleared",
                          text:"Do you still want to continue?"
                        }).then(
                          function(){
                            //webix.message("Confirmed");
                            films_form.clear();
                            films_form.clearValidation();
                          },
                          function(){
                            //webix.message("Rejected");
                          }
                        );
                      }
                    }

                  ]
                },{},{}
              ]
            }
          ]
        },
        {
           template:"The software is provided by <a href='https://webix.com'>https://webix.com</a>. All rights reserved &#169;",
           css:"TextAlign",
           height:30,
           width:550
        }
      ]

  });
  var films_form = $$("films_form");
    });
