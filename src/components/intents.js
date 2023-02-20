// const projectId = 'The Project ID to use, e.g. 'YOUR_GCP_ID';
// const displayName = 'The display name of the intent, e.g. 'MAKE_RESERVATION';
// const trainingPhrasesParts = 'Training phrases, e.g. 'How many people are staying?';
// const messageTexts = 'Message texts for the agent's response when the intent is detected, e.g. 'Your reservation has been confirmed';

// Imports the Dialogflow library
import { IntentsClient } from '@google-cloud/dialogflow';

// Instantiates the Intent Client
const intentsClient = new IntentsClient();

export async function createIntent(displayName, trainingPhrasesParts, messageTexts) {
  // Construct request

  // The path to identify the agent that owns the created intent.
  const agentPath = intentsClient.projectAgentPath(projectId);

  const trainingPhrases = [];

  trainingPhrasesParts.forEach(trainingPhrasesPart => {
    const part = {
      text: trainingPhrasesPart,
    };

    // Here we create a new training phrase for each provided part.
    const trainingPhrase = {
      type: 'EXAMPLE',
      parts: [part],
    };

    trainingPhrases.push(trainingPhrase);
  });

  const messageText = {
    text: messageTexts,
  };

  const message = {
    text: messageText,
  };

  const intent = {
    displayName: displayName,
    trainingPhrases: trainingPhrases,
    messages: [message],
  };

  const createIntentRequest = {
    parent: agentPath,
    intent: intent,
  };

  // Create the intent
  const [response] = await intentsClient.createIntent(createIntentRequest);
  console.log(`Intent ${response.name} created`);
}