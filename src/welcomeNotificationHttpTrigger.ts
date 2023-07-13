import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { notificationApp } from "./internal/initialize";
import welcome from "./adaptiveCards/welcome.json";

// HTTP trigger to send notification.
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  for (const target of await notificationApp.notification.installations()) {
    await target.sendAdaptiveCard(
      AdaptiveCards.declareWithoutData(welcome).render()
    );
  }

  context.res = {};
};

export default httpTrigger;
