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
  }

  Update(level) {
    return http.put("Level", level);
  }

  Delete(id) {
    return http.delete("Level/" + id);
  }
}

export default new LevelService();