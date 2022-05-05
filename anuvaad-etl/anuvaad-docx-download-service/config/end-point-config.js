const HOSTNAME = process.env.CONTENT_HANDLER_SERVER_URL
  ? process.env.CONTENT_HANDLER_SERVER_URL.replace("http://", "").replace(
      ":5001/",
      ""
    )
  : "auth.anuvaad.org";

module.exports = { HOSTNAME };
