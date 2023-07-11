import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { notificationApp } from "./internal/initialize";
import notificationTemplate from "./adaptiveCards/notification-default.json";
import { CardData } from "./cardModels";

const data: CardData = {
  title: "New Event Occurred!",
  appName: "Contoso App",
  description: "Detailed description of what happened so the user knows what's going on.",
  notificationUrl: "https://www.adaptivecards.io/",
};

// HTTP trigger to send notification.
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const postedData: CardData = req.body;
  console.log({ postedData, context });
  // const name = body?.name;
  // if (name) {
  //   data.title = name;
  // }
  const priority = +req.body?.priority;
  if (priority > 2) {
    notificationTemplate.body[0].color = "warning";
  }
  else if (priority === 1 || priority === 2) {
    notificationTemplate.body[0].color = "good";
  } else {
    notificationTemplate.body[0].color = "dark";
  }
  for (const target of await notificationApp.notification.installations()) {
    await target.sendAdaptiveCard(
      AdaptiveCards.declare<CardData>(notificationTemplate).render(postedData)
    );
  }

  context.res = {};
};

export default httpTrigger;
