import { useState } from "react";
import { useChessEngines } from "../hooks/useChessEngines";
import { t } from "i18next";

export function EngineSelector() {
  const { engines, loading, error } = useChessEngines();
  const [selectedEngine, setSelectedEngine] = useState<string>("");

  if (loading) {
    return <div>{t("engineSelector.loading")}</div>;
  }

  if (error) {
    return (
      <div style={{ color: "red" }}>
        {t("engineSelector.error", { error: error })}
      </div>
    );
  }

  if (engines.length === 0) {
    return <div>{t("engineSelector.noEngineFound")}</div>;
  }

  const selected = engines.find((e) => e.packageName === selectedEngine);

  return (
    <div>
      <h2>{t("engineSelector.availableEngines", { count: engines.length })}</h2>

      <select
        value={selectedEngine}
        onChange={(e) => setSelectedEngine(e.target.value)}
      >
        <option value="">{t("engineSelector.chooseAnEngine")}</option>
        {engines.map((engine) => (
          <option key={engine.packageName} value={engine.packageName}>
            {engine.name}
          </option>
        ))}
      </select>

      {selected && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f0f0f0",
          }}
        >
          <h3>{selected.name}</h3>
          <p>
            <strong>{t("engineSelector.packageLabel")}</strong>{" "}
            {selected.packageName}
          </p>
          <p>
            <strong>{t("engineSelector.pathLabel")}</strong> {selected.path}
          </p>
          <p>
            <strong>{t("engineSelector.protocolsLabel")}</strong>{" "}
            {selected.supportedProtocols.join(", ")}
          </p>
        </div>
      )}

      <details style={{ marginTop: "20px" }}>
        <summary>{t("engineSelector.summary")}</summary>
        <ul>
          {engines.map((engine) => (
            <li key={engine.packageName}>
              <strong>{engine.name}</strong>
              <ul>
                <li>
                  {t("engineProtocol.packageValue", {
                    package: engine.packageName,
                  })}
                </li>{" "}
                <li>
                  {t("engineProtocol.pathValue", {
                    path: engine.path,
                  })}
                </li>
                <li>
                  {" "}
                  {t("engineProtocol.protocolsValue", {
                    protocols: engine.supportedProtocols.join(", "),
                  })}
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
