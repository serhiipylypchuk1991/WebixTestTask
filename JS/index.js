
webix.ready(function(){

  var grid_data = [
    { id:1, title:"The Shawshank Redemption", year:1994, votes:678790, rating:9.2, rank:1},
    { id:2, title:"The Godfather", year:1972, votes:511495, rating:9.2, rank:2},
    { id:3, title:"The Godfather: Part II", year:1974, votes:319352, rating:9.0, rank:3},
    { id:4, title:"The Good, the Bad and the Ugly", year:1966, votes:213030, rating:8.9, rank:4},
    { id:5, title:"My Fair Lady", year:1964, votes:533848, rating:8.9, rank:5},
    { id:6, title:"12 Angry Men", year:1957, votes:164558, rating:8.9, rank:6}
  ];

  webix.ui({

    rows:[

        {
          view:"toolbar",
          css:"webix_dark",
          elements:[
            { view: "label", label:"My App"},
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
                    { id:1, title:"Dashboard"},
                    { id:2, title:"Users"},
                    { id:3, title:"Products"},
                    { id:4, title:"Locations"}
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
              view:"form", margin:20,
              width:250,
              elements:[
                {
                  rows:[

                    { template:"EDIT FILMS", type:"section"},
                    { view:"text", label:"Title"},
                    { view:"text", label:"Year" },
                    { view:"text", label:"Rating" },
                    { view:"text", label:"Votes" },
                  ], margin:10
                },
                {
                    cols:[
                    { view:"button", id:"btn_add_new", value:"Add new", css:"webix_primary"},
                    {width:20},
                    { view:"button", id:"btn_clear", value:"Clear", css:"webix_secondary"},
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

});
