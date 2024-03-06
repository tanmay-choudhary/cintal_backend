// let private_key_id = process.env.private_key_id,
//   private_key = process.env.private_key;

let key = {
  type: "service_account",
  project_id: "fir-chat-a3bef",
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key,
  client_email:
    "firebase-adminsdk-n8fhm@fir-chat-a3bef.iam.gserviceaccount.com",
  client_id: "113250561658367588462",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-n8fhm%40fir-chat-a3bef.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
module.exports = { key };
