import { experimental_evaluate as evaluate } from 'ai';

export async function askJev() {
  const input = {
    model: 'typesafe-ai/jev',
    state: {
      situation: 'A runaway trolley is approaching a railway switch.',
      currentTrack: { peopleInDanger: 5 },
      alternateTrack: { peopleInDanger: 1 },
      availableActions: ['continue_straight', 'switch_track'],
    },
    questions: {
      action: {
        type: 'choice',
        instructions: 'Choose the action that minimizes loss of human life.',
        criteria: {
          continue_straight: 'Leave the switch unchanged; five people are in danger.',
          switch_track: 'Move the switch; one person is in danger.',
        },
      },
    },
  };
  const result = await evaluate(input);

  const answer = result.answers.action;

  return {
    choice: answer.choice,
    probabilities: answer.probabilities,
    input,
    output: answer,
  };
}
