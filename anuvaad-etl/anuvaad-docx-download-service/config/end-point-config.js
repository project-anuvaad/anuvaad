// const HOSTNAME = process.env.NODE_HOSTNAME;
const HOSTNAME = process.env.NODE_HOSTNAME.replace("http://", "")

// const HOSTNAME = process.env.CONTENT_HANDLER_SERVER_URL
//   ? process.env.CONTENT_HANDLER_SERVER_URL.replace("http://", "").replace(
//       ":5001/",
//       ""
//     )
//   : process.env.NODE_HOSTNAME;
  module.exports = { HOSTNAME };