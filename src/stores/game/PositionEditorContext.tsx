import { Chess, DEFAULT_POSITION } from "chess.js";
import { createContext, useContext, useReducer } from "react";
import { EMPTY_POSITION, NO_SKILL_LEVEL } from "./GameContext";

export enum PositionEditorActionType {
  resetToDefault,
  resetToLoaded,
  setLoadedPosition,
  changeCurrentPosition,
  erasePosition,
  resetStateToSaved,
  saveCurrentState,
  setComputerSide,
  setUseClock,
  setBaseTimeHours,
  setBaseTimeMinutes,
  setBaseTimeSeconds,
  setBaseIncrementSeconds,
  setUseDifferentTimes,
  setCPUTimeHours,
  setCPUTimeMinutes,
  setCPUTimeSeconds,
  setCPUIncrementSeconds,
  setComputerSkillLevel,
}

interface MiscState {
  computerHasWhite: boolean;
  useClock: boolean;
  baseTimeHours: number;
  baseTimeMinutes: number;
  baseTimeSeconds: number;
  baseIncrementSeconds: number;
  useDifferentTimes: boolean;
  cpuTimeHours: number;
  cpuTimeMinutes: number;
  cpuTimeSeconds: number;
  cpuIncrementSeconds: number;
  computerSkillLevel: number;
}

interface PositionEditor {
  loadedPosition: string;
  // may be an illegal position
  currentPosition: string;
  // must be a legal position
  commitedPosition: string;
  editedState: MiscState;
  updatedState: MiscState;
}

interface PositionEditorAction {
  type: PositionEditorActionType;
  value?: any;
}

const PositionEditorContext = createContext<PositionEditor>(null as any);
const PositionEditorDispatchContext = createContext<
  React.Dispatch<PositionEditorAction>
>(null as any);

const initialState: MiscState = {
  computerHasWhite: true,
  useClock: false,
  baseTimeHours: 0,
  baseTimeMinutes: 5,
  baseTimeSeconds: 0,
  baseIncrementSeconds: 0,
  useDifferentTimes: false,
  cpuTimeHours: 0,
  cpuTimeMinutes: 5,
  cpuTimeSeconds: 0,
  cpuIncrementSeconds: 0,
  computerSkillLevel: NO_SKILL_LEVEL,
};

const initialPositionEditor: PositionEditor = {
  loadedPosition: DEFAULT_POSITION,
  currentPosition: DEFAULT_POSITION,
  commitedPosition: DEFAULT_POSITION,
  editedState: initialState,
  updatedState: initialState,
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
          loadedPosition: action.value,
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
    case PositionEditorActionType.erasePosition: {
      return {
        ...positionEditor,
        currentPosition: EMPTY_POSITION,
      };
    }
    case PositionEditorActionType.resetStateToSaved: {
      return {
        ...positionEditor,
        editedState: positionEditor.updatedState,
        currentPosition: positionEditor.loadedPosition,
      };
    }
    case PositionEditorActionType.saveCurrentState: {
      return {
        ...positionEditor,
        updatedState: positionEditor.editedState,
      };
    }
    case PositionEditorActionType.setComputerSide: {
      return {
        ...positionEditor,
        editedState: {
          ...positionEditor.editedState,
          computerHasWhite: action.value,
        },
      };
    }
    case PositionEditorActionType.setUseClock: {
      return {
        ...positionEditor,
        editedState: {
          ...positionEditor.editedState,
          useClock: action.value,
        },
      };
    }
    case PositionEditorActionType.setBaseTimeHours: {
      return {
        ...positionEditor,
        editedState: {
          ...positionEditor.editedState,
          baseTimeHours: action.value,
        },
      };
    }
    case PositionEditorActionType.setBaseTimeMinutes: {
      return {
        ...positionEditor,
        editedState: {
          ...positionEditor.editedState,
          baseTimeMinutes: action.value,
        },
      };
    }
    case PositionEditorActionType.setBaseTimeSeconds: {
      return {
        ...positionEditor,
        editedState: {
          ...positionEditor.editedState,
          baseTimeSeconds: action.value,
        },
      };
    }
    case PositionEditorActionType.setBaseIncrementSeconds: {
      return {
        ...positionEditor,
        editedState: {
          ...positionEditor.editedState,
          baseIncrementSeconds: action.value,
        },
      };
    }
    case PositionEditorActionType.setUseDifferentTimes: {
      return {
        ...positionEditor,
        editedState: {
          ...positionEditor.editedState,
          useDifferentTimes: action.value,
        },
      };
    }
    case PositionEditorActionType.setCPUTimeHours: {
      return {
        ...positionEditor,
        editedState: {
          ...positionEditor.editedState,
          cpuTimeHours: action.value,
        },
      };
    }
    case PositionEditorActionType.setCPUTimeMinutes: {
      return {
        ...positionEditor,
        editedState: {
          ...positionEditor.editedState,
          cpuTimeMinutes: action.value,
        },
      };
    }
    case PositionEditorActionType.setCPUTimeSeconds: {
      return {
        ...positionEditor,
        editedState: {
          ...positionEditor.editedState,
          cpuTimeSeconds: action.value,
        },
      };
    }
    case PositionEditorActionType.setCPUIncrementSeconds: {
      return {
        ...positionEditor,
        editedState: {
          ...positionEditor.editedState,
          cpuIncrementSeconds: action.value,
        },
      };
    }
    case PositionEditorActionType.setComputerSkillLevel: {
      return {
        ...positionEditor,
        editedState: {
          ...positionEditor.editedState,
          computerSkillLevel: action.value,
        },
      };
    }
    default:
      throw Error("Unknown action: " + action.type);
  }
}
