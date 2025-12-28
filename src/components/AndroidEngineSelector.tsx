import { useState } from "react";
import { useChessEngines } from "../hooks/engine/useChessEngines";
import { useAndroidEngineProcess } from "../hooks/engine/AndroidEngineProcessContext";
import { t } from "i18next";

export function AndroidEngineSelector() {
  const { engines, loading, error } = useChessEngines();
  const { startEngineProcess, engineProcess } = useAndroidEngineProcess();
  const [selectedEngineId, setSelectedEngineId] = useState<string>("");

  const getEngineId = (engine: (typeof engines)[0]) =>
    `${engine.packageName}|${engine.path}`;
  const selected = engines.find((e) => getEngineId(e) === selectedEngineId);

  const handleEngineSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedEngineId(newId);

    if (newId === "") {
      return;
    }

    const selectedEngine = engines.find(
      (engine) => getEngineId(engine) === newId
    );
    if (selectedEngine) {
      console.log(
        `Selected engine: ${selectedEngine.name} at ${selectedEngine.path}`
      );
      startEngineProcess(selectedEngine.path);
    }
  };

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

  return (
    <div>
      <h2>{t("engineSelector.availableEngines", { count: engines.length })}</h2>

      <select value={selectedEngineId} onChange={handleEngineSelect}>
        <option value="">{t("engineSelector.chooseAnEngine")}</option>
        {engines.map((engine) => (
          <option key={getEngineId(engine)} value={getEngineId(engine)}>
            {engine.name}({engine.packageName})
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
        </div>
      )}

      {engineProcess && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#e8f5e9",
            border: "1px solid #4caf50",
            borderRadius: "4px",
          }}
        >
          <h3 style={{ color: "#2e7d32", margin: "0 0 10px 0" }}>
            ✓ Engine Running
          </h3>
          <p>
            <strong>Process ID:</strong> {engineProcess.id}
          </p>
          <p>
            <strong>Path:</strong> {engineProcess.path}
          </p>
        </div>
      )}

      <details style={{ marginTop: "20px" }}>
        <summary>{t("engineSelector.summary")}</summary>
        <ul>
          {engines.map((engine) => (
            <li key={getEngineId(engine)}>
              <strong>{engine.name}</strong>
              <ul>
                <li>
                  {t("engineSelector.packageValue", {
                    package: engine.packageName,
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
