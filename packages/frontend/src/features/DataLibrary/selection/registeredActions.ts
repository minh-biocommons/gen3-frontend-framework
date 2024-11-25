import { sendPFBToURL } from './exportActions';

export type DataActionFunction<T = void> = (
  params: Record<string, any>,
  done?: () => void,
  onError?: (error: Error) => void,
  onAbort?: () => void,
  signal?: AbortSignal,
) => Promise<T>;

// create a factory for the action creators

interface ActionCreatorFactoryItem {
  readonly action: DataActionFunction;
}

const registeredDataLibraryActions: Record<string, ActionCreatorFactoryItem> =
  {};

export const NullAction: DataActionFunction = (): Promise<void> => {
  return new Promise<void>((done) => {
    if (done) done();
  });
};

export const registerAction = (
  actionName: string,
  action: ActionCreatorFactoryItem,
) => {
  registeredDataLibraryActions[actionName] = action;
};

export const findAction = (
  actionName?: string,
): ActionCreatorFactoryItem | undefined => {
  if (actionName === undefined) {
    console.error('DataLibrary: findAction: no name provided');
    return undefined;
  }

  if (!(actionName in registeredDataLibraryActions)) {
    console.error('getButtonAction: no action found for', actionName);
    return undefined;
  }
  return registeredDataLibraryActions[actionName];
};

export const registerDefaultDataLibraryActions = () => {
  registerAction('export-pfb-to-url', {
    action: sendPFBToURL,
  });
};

registerDefaultDataLibraryActions();
