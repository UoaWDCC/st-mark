import { connect, Email } from "node-mailjet";
import config from "../config";

export const sendMail = async (
  name: string,
  email: string,
  content: string,
  profileName: string,
  profileID: string
): Promise<Email.Response> => {
  const mailjet = connect(
    config.get("mailjet_public_key"),
    config.get("mailjet_secret_key")
  );
  const request = await mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: config.get("mailjet_sender_email"),
          Name: "St Mark's Graveyard",
        },
        To: [
          {
            Email: config.get("mailjet_receiver"),
            Name: "Admin",
          },
        ],
        TemplateID: config.get("mailjet_email_template"),
        TemplateLanguage: true,
        Subject: `SUBMISSION: for ${profileName}`,
        Variables: {
          name: name,
          content: content,
          email: email,
          profileName: profileName,
          url: `${config.get("origin")}/admin/edit/profile/${profileID}`,
        },
      },
    ],
  });
  return request;
};
