import { Context, Scenes } from 'telegraf';
import { ChatMember, Message, Update } from 'telegraf/types';

export type ExcludeStatus<T, K extends string> = T extends { status: K } ? never : T;

export type ChatMemberStatus = ChatMember['status'];

export type ChatMemberActive = ExcludeStatus<ChatMember, 'restricted' | 'left' | 'kicked'>;

export type ChatMemberActiveStatus = ChatMemberActive['status'];

export type StickerMessageUpdate = Update.MessageUpdate<Message.StickerMessage>;

export type TextMessageUpdate = Update.MessageUpdate<Message.TextMessage>;

interface ExampleBaseScene1 {
  currentStep: number;
  step0Answer?: string;
  step1Answer?: string;
  step2Answer?: string;
  step3Answer?: string;
  step4Answer?: string;
  stepCanceled?: boolean;
  stepCompleted?: boolean;
}

interface ExampleWizardScene1 {
  step0Answer?: string;
  step1Answer?: string;
  step2Answer?: string;
  step3Answer?: string;
  step4Answer?: string;
  stepCanceled: boolean;
  stepCompleted: boolean;
}

interface MySceneSession extends Scenes.SceneSessionData {
  callerName: string;
  exampleBaseScene1: ExampleBaseScene1;
}

export interface MyWizardSession extends MySceneSession, Scenes.WizardSessionData {
  exampleWizard1: ExampleWizardScene1;
}

export interface MySession extends Scenes.WizardSession<MyWizardSession> {
  firstStart: boolean;
}

export interface MyContext<U extends Update = Update> extends Context<U> {
  fullName?: string; // user's or bot's username
  scene: Scenes.SceneContextScene<MyContext, MyWizardSession>;
  wizard: Scenes.WizardContextWizard<MyContext>;
  session: MySession;
}
