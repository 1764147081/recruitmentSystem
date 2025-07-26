import { getUserRouters } from "../services/index.js";
import { formatRouterTree} from '../libs/utils.js'
export default {
  async setUserRouters({ commit,state }) {
    const userRouters = await getUserRouters(state.uid);
         payload = formatRouterTree(userRouters);

         commit("setUserRouters", payload);
         commit("setAuth", true);
  },
};