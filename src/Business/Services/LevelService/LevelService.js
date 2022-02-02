import moment from "moment";
import http from "../../../Headers/http-common";

class LevelService {


  get() {
    return http.get("Level");
  }

  getById(id) {
    return http.get("Level/" + id);
  }

  Add(level) {
    return http.post("Level", level);
  };

  Update(level) {
    return http.put("Level", level);
  };

  Delete(id) {
    return http.delete("Level/" + id);
  };

  getDateNow() {
    return moment().format("YYYY-MM-DD HH:mm:ss").toString();
  };
}

export default new LevelService();