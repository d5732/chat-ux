export enum PromptMapping {
  SYMPTOMS = "symptoms",
  SYMPTOMS_DURATION = "symptoms_duration",
  AGE = "age",
  DIETARY_PREFERENCES = "dietary_preferences",
  MEDICATIONS = "medications",
  HEALTH_HISTORY = "health_history",
  ALCOHOL_CONSUMPTION = "alcohol_consumption",
  TOBACCO_USE = "tobacco_use",
  NAME = "name",
  LOCATION = "location",
}

export type Prompt = {
  question: string;
  mapsTo: PromptMapping;
};

//encoded order of prompts as position in prompts array
export const prompts: Prompt[] = [
  {
    question:
      "What symptoms are you experiencing? Please be as specific as possible.",
    mapsTo: PromptMapping.SYMPTOMS,
  },
  {
    question: "How long have you been experiencing these symptoms?",
    mapsTo: PromptMapping.SYMPTOMS_DURATION,
  },
  {
    question: "What is your age?",
    mapsTo: PromptMapping.AGE,
  },
  {
    question: "Which option best matches your diet: omnivore, vegetarian, or vegan?",
    mapsTo: PromptMapping.DIETARY_PREFERENCES,
  },
  {
    question: "Are you taking any medications?",
    mapsTo: PromptMapping.MEDICATIONS,
  },
  {
    question:
      "Do you have any health history concerns you would like to mention?",
    mapsTo: PromptMapping.HEALTH_HISTORY,
  },
  {
    question: "Do you drink alcohol?",
    mapsTo: PromptMapping.ALCOHOL_CONSUMPTION,
  },
  {
    question: "Do you use tobacco?",
    mapsTo: PromptMapping.TOBACCO_USE,
  },
  {
    question: "What is your name?",
    mapsTo: PromptMapping.NAME,
  },
];
