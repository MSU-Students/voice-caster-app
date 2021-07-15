import Localbase from "localbase";
let officeDB = new Localbase("officeDB");
officeDB.config.debug = false;
const officeInfoCollection = "office";

class OfficeDBService {
  async addOffice(payload) {
    await officeDB.collection(officeInfoCollection).add(payload);
    console.log("first added!");
  }

  async displayOffices() {
    try {
      const offices = await officeDB.collection(officeInfoCollection).get();
      console.log(offices);
      return offices;
    } catch (e){
      console.log("no offices found!");
    }
  }
}

let officeDBService = new OfficeDBService();

export default officeDBService;
