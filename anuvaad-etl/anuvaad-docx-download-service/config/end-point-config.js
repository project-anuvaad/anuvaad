// const HOSTNAME = process.env.NODE_HOSTNAME;
const OCR_CH = process.env.OCR_CONTENT_HANDLER_SERVER_URL.replace("http://", "").replace(
        ":5009",
        ""
      )

const OCR_CH_PORT = process.env.OCR_CONTENT_HANDLER_SERVER_URL.replace("http://", "").replace(
  ":5001",
  ""
)
      
const CH = process.env.CONTENT_HANDLER_SERVER_URL.replace("http://", "").replace(
  ":5001/",
  ""
)
// const HOSTNAME = process.env.CONTENT_HANDLER_SERVER_URL
//   ? process.env.CONTENT_HANDLER_SERVER_URL.replace("http://", "").replace(
//       ":5001/",
//       ""
//     )
//   : process.env.NODE_HOSTNAME;
  module.exports = { CH, OCR_CH,OCR_CH_PORT};