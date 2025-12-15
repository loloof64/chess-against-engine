import { Chess, DEFAULT_POSITION } from "chess.js";
import { createContext, useContext, useReducer } from "react";

export enum PositionEditorActionType {
  resetToDefault,
  resetToLoaded,
  setLoadedPosition,
  changeCurrentPosition,
}

interface PositionEditor {
  loadedPosition: string;
  // may be an illegal position
  currentPosition: string;
  // must be a legal position
  commitedPosition: string;
}

interface PositionEditorAction {
  type: PositionEditorActionType;
  value?: any;
}

const PositionEditorContext = createContext<PositionEditor>(null as any);
const PositionEditorDispatchContext = createContext<
  React.Dispatch<PositionEditorAction>
>(null as any);

const initialPositionEditor: PositionEditor = {
  loadedPosition: DEFAULT_POSITION,
  currentPosition: DEFAULT_POSITION,
  commitedPosition: DEFAULT_POSITION,
};

export function usePositionEditor() {
  return useContext(PositionEditorContext);
}

export function usePositionEditorDispatch() {
  return useContext(PositionEditorDispatchContext);
}

export default function PositionEditorProvider({ children }: any) {
  const [editor, dispatch] = useReducer(
    positionEditorReducer,
    initialPositionEditor
  );

  return (
    <PositionEditorContext.Provider value={editor}>
      <PositionEditorDispatchContext.Provider value={dispatch}>
        {children}
      </PositionEditorDispatchContext.Provider>
    </PositionEditorContext.Provider>
  );
}

function positionEditorReducer(
  positionEditor: PositionEditor,
  action: PositionEditorAction
): PositionEditor {
  switch (action.type) {
    case PositionEditorActionType.resetToDefault:
      return {
        ...positionEditor,
        currentPosition: DEFAULT_POSITION,
        commitedPosition: DEFAULT_POSITION,
      };
    case PositionEditorActionType.resetToLoaded: {
      try {
        new Chess(positionEditor.loadedPosition);
        return {
          ...positionEditor,
          currentPosition: positionEditor.loadedPosition,
          commitedPosition: positionEditor.loadedPosition,
        };
      } catch (ex) {
        console.error(ex);
        return positionEditor;
      }
    }
    // Will reject illegal positions
    case PositionEditorActionType.setLoadedPosition: {
      try {
        new Chess(action.value);
        return {
          ...positionEditor,
          currentPosition: action.value,
          commitedPosition: action.value,
        };
      } catch (ex) {
        console.error(ex);
        return positionEditor;
      }
    }
    // Can update to an illegal position
    case PositionEditorActionType.changeCurrentPosition: {
      return {
        ...positionEditor,
        currentPosition: action.value,
      };
    }
    default:
      throw Error("Unknown action: " + action.type);
  }
}
