import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import notificationTemplate from "./adaptiveCards/notification-default.json";
import { CardData } from "./cardModels";
import { notificationApp } from "./internal/initialize";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const data = req.body;
  const email = data.email; // Assuming the email address is posted in the request body
  const members = notificationApp.notification;
  console.log({ members, email, data })
  // Find the member with the specified email address
  const member = await notificationApp.notification.findMember(
    async (m) => m.account.email === email
  );
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  console.log({ member: member })
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  if (member) {
    // Send the adaptive card only to the specified member
    await member.sendAdaptiveCard(
      AdaptiveCards.declare<CardData>(notificationTemplate).render({
        title: "New Event Occurred!",
        appName: "Contoso App Notification",
        description: `This is a sample http-triggered notification to ${email}`,
        notificationUrl: "https://aka.ms/teamsfx-notification-new",
      })
    );
  }

  context.res = {};
};

export default httpTrigger;
