import { getUserRouters } from "../services/index.js";
import { formatRouterTree} from '../libs/utils.js'
import router from '@/router';
export default {
  async setUserRouters({ commit,state }) {
    const userRouters = await getUserRouters(state.uid);
    const payload = formatRouterTree(userRouters);

    commit("setUserRouters", payload);
    commit("setAuth", true);

    // Dynamically add routes instead of reassigning router
    payload.forEach(route => {
      router.addRoute(route);
    });
  },
};