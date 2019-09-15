const express = require('express');
const app = express();
const axios = require('axios');

const COX_API = 'http://api.coxauto-interview.com/api'
const PORT = 3000;

//{ 
//   "dealers": [
//     {
//       "dealerId": 0,
//       "name": "string",
//       "vehicles": [
//         {
//           "vehicleId": 0,
//           "year": 0,
//           "make": "string",
//           "model": "string"
//         }
//       ]
//     }
//   ]
// }


const getAllVehicles = (dataId, curVehicle) => new Promise((resolve, reject) => {
    axios.get(`${COX_API}/${dataId}/vehicles/${curVehicle}`)
        .then(res => {
            resolve(res.data)
        }).catch(err => reject(err))
})


const getVehicles = (dataId, vehicles) => new Promise((resolve, reject) => {
    const allVehicles = [];
    for (let cur in vehicles) {
      curVehicle = vehicles[cur];

      getAllVehicles(dataId, curVehicle).then((done) => {
        allVehicles.push(done)
        if (allVehicles.length === vehicles.length)
            resolve(allVehicles)
      }).catch(err => reject(err))
    }
})

const getInfo = () => {
    const data = {};
    data.dealers = [];
    let index;
    let dealerIndex;
  
    axios.get(`${COX_API}/datasetId`)
      .then(({ data: { datasetId } }) => {
        axios.get(`${COX_API}/${datasetId}/vehicles`)  
          .then(({ data: { vehicleIds }}) => {
            getVehicles(datasetId, vehicleIds).then(async (allVehicles) => {
                let dealerIds = [];

                 for(let curVehicle = 0; curVehicle < allVehicles.length; curVehicle++){

                    if(!dealerIds.includes(allVehicles[curVehicle].dealerId)){
                        dealerIndex = data.dealers.length;
                        dealerIds.push(allVehicles[curVehicle].dealerId, dealerIndex);

                        await axios.get(`${COX_API}/${datasetId}/dealers/${allVehicles[curVehicle].dealerId}`)
                            .then(res => {
                                data.dealers.push({
                                    "dealerId": allVehicles[curVehicle].dealerId,
                                    "name": res.data.name,
                                    "vehicles": [
                                        {
                                            "vehicleId": allVehicles[curVehicle].vehicleId,
                                            "year": allVehicles[curVehicle].year,
                                            "make": allVehicles[curVehicle].make,
                                            "model": allVehicles[curVehicle].model 
                                        }
                                    ]
                                })
                            })

                    } else {
                        
                        for(let curDealer = 0; curDealer < dealerIds.length - 1; curDealer += 2){
                            if(dealerIds[curDealer] === allVehicles[curVehicle].dealerId){
                                index = dealerIds[curDealer + 1];
    
                                data.dealers[index].vehicles.push({
                                    "vehicleId": allVehicles[curVehicle].vehicleId,
                                    "year": allVehicles[curVehicle].year,
                                    "make": allVehicles[curVehicle].make,
                                    "model": allVehicles[curVehicle].model
                                })
                                break;
                            }
                        }
                    }
                }

                axios.post(`${COX_API}/${datasetId}/answer`, { dealers: data.dealers})
                    .then(res => {
                        console.log(res.data);
                    })
                    
            })
            
           })
           .catch(err => console.log("ERROR GETTING VEHICLE DATA:", err))
      })
      .catch(err => console.log("ERROR GETTING DATAID", err))
}
getInfo();

app.listen(PORT, ()=> console.log(`listening on ${PORT} `))