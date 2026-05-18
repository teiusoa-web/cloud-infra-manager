import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [vms, setVMs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newVmName, setNewVmName] = useState("");
  const [newVmZone, setNewVmZone] = useState("asia-southeast1-b");

  const loadVMs = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/vms/`);
      const result = await response.json();

      setVMs(result.data || []);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const createVM = async () => {
    if (!newVmName) {
      alert("Nhập tên VM trước");
      return;
    }

    await fetch(`${API_URL}/vms/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newVmName,
        zone: newVmZone,
      }),
    });

    setNewVmName("");
    loadVMs();
  };

  const startVM = async (zone, name) => {
    await fetch(`${API_URL}/vms/${zone}/${name}/start`, {
      method: "POST",
    });

    loadVMs();
  };

  const stopVM = async (zone, name) => {
    await fetch(`${API_URL}/vms/${zone}/${name}/stop`, {
      method: "POST",
    });

    loadVMs();
  };

  const resetVM = async (zone, name) => {
    await fetch(`${API_URL}/vms/${zone}/${name}/reset`, {
      method: "POST",
    });

    loadVMs();
  };

  const deleteVM = async (zone, name) => {
    const confirmDelete = confirm(`Xoá VM ${name}?`);

    if (!confirmDelete) return;

    await fetch(`${API_URL}/vms/${zone}/${name}`, {
      method: "DELETE",
    });

    loadVMs();
  };

  useEffect(() => {
    loadVMs();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>☁ Cloud Infra Manager</h1>
          <p className="text-muted">
            Quản lý VM Google Cloud bằng FastAPI, React và Pulumi
          </p>
        </div>

        <button className="btn btn-primary" onClick={loadVMs}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="card shadow mb-4">
        <div className="card-body">
          <h5>Create VM</h5>

          <div className="row g-2">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="VM name, ví dụ: vm-demo"
                value={newVmName}
                onChange={(e) => setNewVmName(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={newVmZone}
                onChange={(e) => setNewVmZone(e.target.value)}
              >
                <option value="asia-southeast1-a">asia-southeast1-a</option>
                <option value="asia-southeast1-b">asia-southeast1-b</option>
                <option value="asia-southeast1-c">asia-southeast1-c</option>
                <option value="us-central1-a">us-central1-a</option>
              </select>
            </div>

            <div className="col-md-3">
              <button className="btn btn-success w-100" onClick={createVM}>
                Create VM
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <h5>VM List</h5>

          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Machine Type</th>
                <th>Internal IP</th>
                <th>External IP</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {vms.map((vm) => {
                const zone = vm.zone?.split("/").pop();
                const machineType = vm.machineType?.split("/").pop();
                const internalIP =
                  vm.networkInterfaces?.[0]?.networkIP || "-";
                const externalIP =
                  vm.networkInterfaces?.[0]?.accessConfigs?.[0]?.natIP || "-";

                return (
                  <tr key={vm.id}>
                    <td>{vm.name}</td>
                    <td>{zone}</td>
                    <td>
                      {vm.status === "RUNNING" ? (
                        <span className="badge bg-success">RUNNING</span>
                      ) : (
                        <span className="badge bg-secondary">
                          {vm.status}
                        </span>
                      )}
                    </td>
                    <td>{machineType}</td>
                    <td>{internalIP}</td>
                    <td>{externalIP}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => startVM(zone, vm.name)}
                      >
                        Start
                      </button>

                      <button
                        className="btn btn-warning btn-sm ms-2"
                        onClick={() => stopVM(zone, vm.name)}
                      >
                        Stop
                      </button>

                      <button
                        className="btn btn-info btn-sm ms-2"
                        onClick={() => resetVM(zone, vm.name)}
                      >
                        Reset
                      </button>

                      <button
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => deleteVM(zone, vm.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {vms.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    Không có VM nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;