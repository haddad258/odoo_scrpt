const app = require("../index");
const uuid = require("uuid");
const createHttpError = require("http-errors");
function Item(commande, session, id) {

  this.commande = commande;
  this.session = session;
  this.id = id;

}
class Commande {
  constructor(pos_reference, name, note) {
    this.pos_reference = new Item(pos_reference.substr(0, 14), pos_reference.substr(15, 3), pos_reference.substr(19, 4));
    this.name = name;
    this.note = note;
  }
}


function padLeadingZeros(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function distinctvalue(array) {

  var flags = [], output = [], l = array.length, i;
  for (i = 0; i < l; i++) {

    if ((flags[array[i].pos_reference.commande])) continue;
    flags[array[i].pos_reference.commande] = true;
    output.push(array[i].pos_reference.commande);
  }
  return output;
}
app.get("/anomaly/pickup", async (req, res, next) => {
  try {
    const category = (await app
      .db("pos_order as m")
      .select("*")).sort(function (a, b) {

        return a.id - b.id
      })
      
     /*  .transaction(async (trx) => {
       await trx
          .table("pos_order")
          .update({state : "done1" })
    
      }) */
      // for (let index = 0; index < category.length; index++) {
      //   await app.db
      //   .table("pos_order")
      //   .update({
      //     state: index,
          
      //   })
        
      // }
      app.db
      .transaction(async (trx) => {

        for (const index of category) {
          await trx
          .table("pos_order")
          .update({
            state: index.id,
            
          })
          
        }

      })
     

    // var m=category.map((e) => ({ ...e, note: category.indexOf(e) }))
    var table = category.map(e => new Commande(e.pos_reference, e.name, padLeadingZeros((category.indexOf(e) + 1), 4)))
   var fisrttable= distinctvalue(table).map(e=> table.sort(el=>{
       if((el.pos_reference.session === e)){
         console.log(el.pos_reference.session)
         return el
       }
    
   }))
    res.json({
      message: "anomaly messege fetched",
      status: 200,
    //  fisrttable:fisrttable,
    data: table,
     // distinct: distinctvalue(table)
    });
  } catch (error) {
    console.log(error);
    next(new createHttpError.InternalServerError("Internal Server Error"));
  }
});
