// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  CHAT_URL: "ws://140.238.54.136:8080/chat/chat",
  action: "onchat",
  event: {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    RE_LOGIN: "RE_LOGIN",
    REGISTER: "REGISTER",
    SEND_CHAT: "SEND_CHAT",
    CREATE_ROOM: "CREATE_ROOM",
    GET_ROOM_CHAT_MES: "GET_ROOM_CHAT_MES",
    JOIN_ROOM: "JOIN_ROOM",
    GET_PEOPLE_CHAT_MES: "GET_PEOPLE_CHAT_MES",
    CHECK_USER: "CHECK_USER",
    GET_USER_LIST: "GET_USER_LIST",
  },
  firebaseConfig: {
    apiKey: "AIzaSyCR44lmiTtk7OyWTEH5F8cvwg31nkYsAkM",
    authDomain: "chitchat-e6ec4.firebaseapp.com",
    projectId: "chitchat-e6ec4",
    storageBucket: "chitchat-e6ec4.appspot.com",
    messagingSenderId: "21589694984",
    appId: "1:21589694984:web:fe03ef737e374c9756cfbd",
    measurementId: "G-B0B5LLEHG0"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
