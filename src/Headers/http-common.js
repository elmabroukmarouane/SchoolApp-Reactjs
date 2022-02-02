import axios from "axios";
import { config } from "../Configurations/config";
import authHeader from "./auth-header"

export default axios.create({
  baseURL: config.API_URL,
  headers: authHeader()
});
