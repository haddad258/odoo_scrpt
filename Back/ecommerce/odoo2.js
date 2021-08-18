const app = require("../index");
const uuid = require("uuid");
const createHttpError = require("http-errors");
var _ = require('lodash');

function Item(commande, session, id) {

  this.commande = commande;
  this.session = session;
  this.id = id;

}
class Commande {
  constructor(id,pos_reference, commande, session,idcommande, name, note) {
    // this.pos_reference = new Item(pos_reference.substr(0, 14), pos_reference.substr(15, 3), pos_reference.substr(19, 4));
    this.pos_reference = pos_reference
    this.commande = commande.substr(0, 14)
    this.session = session.substr(15, 3);
    this.idcommande= idcommande.substr(19, 4)
    this.name = name;
    this.note = "Main/"+note;
    this.id = id;
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
app.get("/listdata/order", async (req, res, next) => {
  try {
    const category = (await app
      .db("pos_order as m")
      .select("*")).sort(function (a, b) {

        return a.id - b.id
      })

    // var m=category.map((e) => ({ ...e, note: category.indexOf(e) }))
    var table = category.map(e => new Commande(e.id,e.pos_reference, e.pos_reference, e.pos_reference,e.pos_reference,e.name, padLeadingZeros((category.indexOf(e) + 1), 4)))
    var fisrttable = distinctvalue(table).map(e => table.sort(el => {
      if ((el.pos_reference.session === e)) {
        console.log(el.pos_reference.session)
        return el
      }

    }))

    var result = _(table)
      .map('commande')
      .uniq()
      .map(key => ({
        key,
        val: _(table).filter({ commande: key }).value().map((e, index) => ({ ...e, key: index + 1,message:e.commande+"-" +e.session+ "-"+padLeadingZeros(index + 1,4) }))
      }))
      .value();
    res.json({
      message: "anomaly messege fetched",
      status: 200,
      //  fisrttable:fisrttable,
      data: result,
      // distinct: distinctvalue(table)
    });
  } catch (error) {
    console.log(error);
    next(new createHttpError.InternalServerError("Internal Server Error"));
  }
});

app.put("/changeall",  async (req, res, next) => {
  console.log(req.body)
  try {
    
    app.db
      .transaction(async (trx) => {
      

        for (const pack of req.body.data) {
          await trx
            .table("pos_order")
            .update({
              pos_reference:pack.newcommande,
              name:pack.name
              
            })
            .where("id", "=", pack.id)
         
        }
      })
      .then(function () {
        res.status(200).json({
          message: "Successfully checked colis",
          status: 200,
          data: req.body,
        });
      })
      .catch(function (err) {
        console.error(err);
        next(new createHttpError.InternalServerError("Internal server error"));
      });
  } catch (error) {
    console.log(error);
    next(new createHttpError.InternalServerError("Internal server error"));
  }
});
