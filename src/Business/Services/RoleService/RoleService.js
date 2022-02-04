import http from "../../../Headers/http-common";

class RoleService {


  get() {
    return http.get("Role");
  }

  getById(id) {
    return http.get("Role/" + id);
  }

  Add(Role) {
    return http.post("Role", Role);
  }

  Update(Role) {
    return http.put("Role", Role);
  }

  Delete(id) {
    return http.delete("Role/" + id);
  }
}

export default new RoleService();