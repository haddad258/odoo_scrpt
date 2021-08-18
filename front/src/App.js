
import React, { useState } from 'react';

import { Button, Card } from "react-bootstrap"
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import axios from "axios"

const columnsss = [
  {
    dataField: 'id',
    text: ' id'
  },
  {
    dataField: 'name',
    text: ' name'
  },
  {
    dataField: 'note',
    text: ' final name'
  },
  {
    dataField: 'pos_reference',
    text: 'pos_reference'
  }, {
    dataField: 'commande',
    text: ' Name commande'
  },

  {
    dataField: 'idcommande',
    text: ' idcommande'
  },
  {
    dataField: 'message',
    text: 'final commande'
  },


];
function App() {

  //const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [data1, setDataa] = useState([]);
  // useEffect(() => {
  //   axios.get("http://localhost:3001/anomaly/pickupa").then((respo) => {
  //     console.log(respo.data.data)
  //     // respo.data.data.map(e=>setDataa(...data,e.val))
  //   })

  // }, [])

  const getdata = () => {
    axios.get("http://localhost:3001/listdata/order").then((respo) => {
      //   console.log(respo.data.data)
      var m = []
      respo.data.data.forEach(element => {
        // m.push(element.val.map(e=>e))
        element.val.map(e => m.push(e))
      });
      setDataa(m)
      // respo.data.data.map(e=>setDataa(...data,e.val))
    })

  }


  const senddata = e => {
    console.log(data1.map(e => ({
      id: e.id,
      name: e.note,
      newcommande: e.message


    })))


    axios.put("http://localhost:3001/changeall", { "data": data1.map(e => ({
      id: e.id,
      name: e.note,
      newcommande: e.message


    })) })
      .then(response => {
        console.log(response.data)
        getdata()
        alert("suucceful")
        setData([])
      })
      .catch(e => {
        console.log(e)
      })

  }

  return (
    <div style={{ background: "#FFFFFF" }}>
      <Card title="Ajouter Pickups en masse">
        {/* <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
      /> */}
        {/* <DataTable
        pagination
        highlightOnHover
        columns={columns}
        data={data}
      /> */}
        <Button onClick={() => getdata()} > get data</Button>
        <Button variant="success" onClick={() => senddata()} > send data</Button>

        <BootstrapTable
          keyField="id"
          data={data1}
          columns={columnsss}
          cellEdit={cellEditFactory({ mode: 'click' })}

        />

      </Card>
    </div>
  );
}

export default App;
