import { useEffect, useState } from "react";
import {
  listVMs,
  createVM,
  startVM,
  stopVM,
  resetVM,
  deleteVM,
  pulumiPreview,
  pulumiUp,
  pulumiDestroy,
  pulumiOutputs,
} from "./api";

function App() {
  const [vms, setVms] = useState([]);
  const [name, setName] = useState("demo-vm");
  const [zone, setZone] = useState("asia-southeast1-a");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [infraLog, setInfraLog] = useState("");
  const [infraOutput, setInfraOutput] = useState(null);

  const getZoneName = (zoneUrl) => {
    if (!zoneUrl) return "";
    return zoneUrl.split("/").pop();
  };

  const getMachineTypeName = (machineUrl) => {
    if (!machineUrl) return "";
    return machineUrl.split("/").pop();
  };

  const loadVMs = async () => {
    setLoading(true);

    try {
      const data = await listVMs();
      const parsed = data.stdout ? JSON.parse(data.stdout) : [];
      setVms(parsed);
    } catch {
      setMessage("Không thể tải VM list");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadVMs();
  }, []);

  const handleCreate = async () => {
    if (!name || !zone) {
      setMessage("Vui lòng nhập VM name và zone");
      return;
    }

    setLoading(true);

    const result = await createVM({
      name,
      zone,
    });

    setMessage(
      result.success
        ? "Tạo VM thành công"
        : result.stderr || result.error || "Tạo VM thất bại"
    );

    await loadVMs();
    setLoading(false);
  };

  const handleAction = async (action, vm) => {
    setLoading(true);

    const vmZone = getZoneName(vm.zone);

    let result;

    if (action === "start") {
      result = await startVM(vmZone, vm.name);
    }

    if (action === "stop") {
      result = await stopVM(vmZone, vm.name);
    }

    if (action === "reset") {
      result = await resetVM(vmZone, vm.name);
    }

    if (action === "delete") {
      result = await deleteVM(vmZone, vm.name);
    }

    setMessage(
      result.success
        ? `${action} VM thành công`
        : result.stderr || result.error || `${action} VM thất bại`
    );

    await loadVMs();
    setLoading(false);
  };

  const handlePulumiAction = async (action) => {
    setLoading(true);
    setInfraLog("");
    setInfraOutput(null);

    let result;

    if (action === "preview") {
      result = await pulumiPreview();
    }

    if (action === "up") {
      result = await pulumiUp();
    }

    if (action === "destroy") {
      result = await pulumiDestroy();
    }

    if (action === "outputs") {
      result = await pulumiOutputs();
    }

    setMessage(
      result.success
        ? `Pulumi ${action} thành công`
        : result.stderr || result.error || `Pulumi ${action} thất bại`
    );

    if (action === "outputs" && result.stdout) {
      try {
        setInfraOutput(JSON.parse(result.stdout));
      } catch {
        setInfraLog(result.stdout);
      }
    } else {
      setInfraLog(result.stdout || result.stderr || result.error || "");
    }

    await loadVMs();
    setLoading(false);
  };

  const runningCount = vms.filter((vm) => vm.status === "RUNNING").length;
  const stoppedCount = vms.filter((vm) => vm.status === "TERMINATED").length;

  return (
    <div className="app-bg">
      <nav className="topbar">
        <div>
          <h1>☁ Cloud Infra Manager</h1>
          <p>FastAPI • React • Pulumi • GCP</p>
        </div>

        <button className="refresh-btn" onClick={loadVMs}>
          Refresh
        </button>
      </nav>

      <div className="dashboard-grid">
        <div className="stat-card">
          <span>Total VMs</span>
          <h2>{vms.length}</h2>
        </div>

        <div className="stat-card green">
          <span>Running</span>
          <h2>{runningCount}</h2>
        </div>

        <div className="stat-card red">
          <span>Stopped</span>
          <h2>{stoppedCount}</h2>
        </div>
      </div>

      {message && <div className="info-box">{message}</div>}

      {loading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <section className="panel">
        <div className="panel-header">
          <h2>Create VM</h2>
          <p>Tạo Google Compute Engine VM</p>
        </div>

        <div className="create-form">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VM Name"
          />

          <div className="zone-selector-inline">
            {[
              "asia-southeast1-a",
              "asia-southeast1-b",
              "asia-southeast1-c",
              "asia-east1-a",
              "us-central1-a",
            ].map((item) => (
              <button
                key={item}
                type="button"
                className={`zone-pill ${zone === item ? "active-zone-pill" : ""}`}
                onClick={() => setZone(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <button className="primary-btn" onClick={handleCreate}>
            Create VM
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Pulumi Infrastructure</h2>
          <p>Quản lý Infrastructure as Code</p>
        </div>

        <div className="infra-buttons">
          <button
            className="outline-btn"
            onClick={() => handlePulumiAction("preview")}
          >
            Preview
          </button>

          <button
            className="primary-btn"
            onClick={() => handlePulumiAction("up")}
          >
            Pulumi Up
          </button>

          <button
            className="danger-btn"
            onClick={() => handlePulumiAction("destroy")}
          >
            Destroy
          </button>

          <button
            className="dark-btn"
            onClick={() => handlePulumiAction("outputs")}
          >
            Outputs
          </button>
        </div>

        {infraOutput?.vm_ip && (
          <div className="output-card">
            <span>VM Public IP</span>
            <h3>{infraOutput.vm_ip}</h3>
          </div>
        )}

        {infraLog && (
          <pre className="console-box">
            {infraLog}
          </pre>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>VM List</h2>
          <p>Quản lý trạng thái VM</p>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Machine Type</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {vms.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">
                    Chưa có VM nào
                  </td>
                </tr>
              ) : (
                vms.map((vm) => (
                  <tr key={vm.id || vm.name}>
                    <td className="vm-name">{vm.name}</td>
                    <td>{getZoneName(vm.zone)}</td>

                    <td>
                      <span
                        className={`status-badge ${vm.status}`}
                      >
                        {vm.status}
                      </span>
                    </td>

                    <td>
                      {getMachineTypeName(vm.machineType)}
                    </td>

                    <td>
                      <div className="vm-action-wrapper">
                        <div className="action-buttons">
                          <button
                            className="action-btn start-btn"
                            onClick={() => handleAction("start", vm)}
                            disabled={loading}
                          >
                            ▶ Start
                          </button>

                          <button
                            className="action-btn stop-btn"
                            onClick={() => handleAction("stop", vm)}
                            disabled={loading}
                          >
                            ■ Stop
                          </button>

                          <button
                            className="action-btn reset-btn"
                            onClick={() => handleAction("reset", vm)}
                            disabled={loading}
                          >
                            ↻ Reset
                          </button>

                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleAction("delete", vm)}
                            disabled={loading}
                          >
                            🗑 Delete
                          </button>
                        </div>

                        <div className="vm-note">
                          {vm.status === "RUNNING"
                            ? "VM đang hoạt động"
                            : "VM đã dừng"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
