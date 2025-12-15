import { t } from "i18next";
import "./AdvancedOptions.css";

function AdvancedOptions() {
  return (
    <div className="advancedOptions">
      <div className="field">
        <label>{t("dialogs.positionEditor.advanced.turn.label")}</label>
        <div className="radioOption">
          <input
            type="radio"
            name="turn"
            value="whiteTurn"
            id="whiteTurn"
            checked
            onChange={() => {}}
          />
          <label htmlFor="whiteTurn">
            {t("dialogs.positionEditor.advanced.turn.white")}
          </label>
        </div>
        <div className="radioOption">
          <input
            type="radio"
            name="turn"
            value="blackTurn"
            id="blackTurn"
            onChange={() => {}}
          />
          <label htmlFor="blackTurn">
            {t("dialogs.positionEditor.advanced.turn.black")}
          </label>
        </div>
      </div>
      <div className="field">
        <label>{t("dialogs.positionEditor.advanced.castles.label")}</label>
        <div className="checkboxOption">
          <input
            type="checkbox"
            name="castleWhiteOO"
            id="castleWhiteOO"
            onChange={() => {}}
          />
          <label htmlFor="castleWhiteOO">
            {t("dialogs.positionEditor.advanced.castles.whiteOO")}
          </label>
        </div>
        <div className="checkboxOption">
          <input
            type="checkbox"
            name="castleWhiteOOO"
            id="castleWhiteOOO"
            onChange={() => {}}
          />
          <label htmlFor="castleWhiteOOO">
            {t("dialogs.positionEditor.advanced.castles.whiteOOO")}
          </label>
        </div>
        <div className="checkboxOption">
          <input
            type="checkbox"
            name="castleBlackOO"
            id="castleBlackOO"
            onChange={() => {}}
          />
          <label htmlFor="castleBlackOO">
            {t("dialogs.positionEditor.advanced.castles.blackOO")}
          </label>
        </div>
        <div className="checkboxOption">
          <input
            type="checkbox"
            name="castleBlackOOO"
            id="castleBlackOOO"
            onChange={() => {}}
          />
          <label htmlFor="castleBlackOOO">
            {t("dialogs.positionEditor.advanced.castles.blackOOO")}
          </label>
        </div>
      </div>

      <div className="field">
        <label htmlFor="enPassantFile">
          {t("dialogs.positionEditor.advanced.enPassantFile")}
        </label>
        <select
          name="enPassantFile"
          className="enPassantFile"
          onChange={() => {}}
        >
          <option value="none" defaultValue="-">
            -
          </option>
          <option value="a">a</option>
          <option value="b">b</option>
          <option value="c">c</option>
          <option value="d">d</option>
          <option value="e">e</option>
          <option value="f">f</option>
          <option value="g">g</option>
          <option value="h">h</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="drawHalfMovesCount">
          {t("dialogs.positionEditor.advanced.drawHalfMovesCount")}
        </label>
        <input type="number" name="drawHalfMovesCount" />
      </div>

      <div className="field">
        <label htmlFor="moveNumber">
          {t("dialogs.positionEditor.advanced.moveNumber")}
        </label>
        <input type="number" name="moveNumber" />
      </div>
    </div>
  );
}

export default AdvancedOptions;
