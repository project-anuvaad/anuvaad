// const HOSTNAME = process.env.NODE_HOSTNAME;
const HOSTNAME = process.env.NODE_HOSTNAME
  ? process.env.NODE_HOSTNAME.replace("http://", "").replace(
      ":5001/",
      ""
    )
  : process.env.NODE_HOSTNAME;

  module.exports = { HOSTNAME };