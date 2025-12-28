export const socketListenEmitAndOn = Object.freeze({

  /* ================= INIT ================= */
  init: Object.freeze({
    ping_pong: "ping_pong",

    customer: Object.freeze({
      start_live_chat_init: "start_live_chat_init",
      start_live_chat_leave: "start_live_chat_leave",
    }),
  }),

  /* ================= CHAT ================= */
  liveChatCreate: Object.freeze({
    customer: Object.freeze({
      received: "live_chat_customer_chat_created_received",
    }),
    admin: Object.freeze({
      received: "live_chat_admin_chat_created_received",
    }),
  }),

  liveChatUpdate: Object.freeze({
    customer: Object.freeze({
      received: "live_chat_customer_chat_updated_received",
    }),
    admin: Object.freeze({
      received: "live_chat_admin_chat_updated_received",
    }),
  }),

  liveChatDelete: Object.freeze({
    customer: Object.freeze({
      received: "live_chat_customer_chat_deleted_received",
    }),
    admin: Object.freeze({
      received: "live_chat_admin_chat_deleted_received",
    }),
  }),

  /* ================= MESSAGE ================= */
  liveChatMessageRead: Object.freeze({
    customer: Object.freeze({
      received: "live_chat_customer_message_read_received",
    }),
    admin: Object.freeze({
      received: "live_chat_admin_message_read_received",
    }),
  }),

  liveChatMessageCreate: Object.freeze({
    customer: Object.freeze({
      received: "live_chat_customer_message_created_received",
    }),
    admin: Object.freeze({
      received: "live_chat_admin_message_created_received",
    }),
  }),

  liveChatMessageUpdate: Object.freeze({
    customer: Object.freeze({
      received: "live_chat_customer_message_updated_received",
    }),
    admin: Object.freeze({
      received: "live_chat_admin_message_updated_received",
    }),
  }),

  liveChatMessageDelete: Object.freeze({
    customer: Object.freeze({
      received: "live_chat_customer_message_deleted_received",
    }),
    admin: Object.freeze({
      received: "live_chat_admin_message_deleted_received",
    }),
  }),
});
