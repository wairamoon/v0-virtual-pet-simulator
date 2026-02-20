import { onRequestPost as __api_chat_js_onRequestPost } from "/home/dumbleclaw/.openclaw/workspace/v0-virtual-pet-simulator/functions/api/chat.js"

export const routes = [
    {
      routePath: "/api/chat",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_chat_js_onRequestPost],
    },
  ]