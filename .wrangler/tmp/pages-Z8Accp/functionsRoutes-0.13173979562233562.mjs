import { onRequestPost as __api_chat_js_onRequestPost } from "/home/dumbleclaw/projects/v0-virtual-pet-simulator/functions/api/chat.js"
import { onRequestPost as __api_evaluate_design_js_onRequestPost } from "/home/dumbleclaw/projects/v0-virtual-pet-simulator/functions/api/evaluate-design.js"

export const routes = [
    {
      routePath: "/api/chat",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_chat_js_onRequestPost],
    },
  {
      routePath: "/api/evaluate-design",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_evaluate_design_js_onRequestPost],
    },
  ]