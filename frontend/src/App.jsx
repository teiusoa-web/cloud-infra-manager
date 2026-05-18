import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [vms, setVMs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadVMs = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/vms/`);
      const data = await response.json();

      const parsed = JSON.parse(data.stdout || "[]");

      setVMs(parsed);

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const startVM = async (zone, name) => {
    await fetch(
      `${API_URL}/vms/${zone}/${name}/start`,
      {
        method: "POST"
      }
    );

    loadVMs();
  };

  const stopVM = async (zone, name) => {
    await fetch(
      `${API_URL}/vms/${zone}/${name}/stop`,
      {
        method: "POST"
      }
    );

    loadVMs();
  };

  useEffect(() => {
    loadVMs();
  }, []);

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Cloud Infra Manager</h1>

      <button onClick={loadVMs}>
        {loading ? "Loading..." : "Refresh"}
      </button>

      <table
        border="1"
        cellPadding="10"
        style={{
          marginTop: 20,
          borderCollapse: "collapse"
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Zone</th>
            <th>Status</th>
            <th>Machine Type</th>
            <th>Internal IP</th>
            <th>External IP</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {vms.map((vm) => {

            const zone =
              vm.zone?.split("/").pop();

            const machineType =
              vm.machineType?.split("/").pop();

            return (
              <tr key={vm.id}>
                <td>{vm.name}</td>

                <td>{zone}</td>

                <td>{vm.status}</td>

                <td>{machineType}</td>

                <td>
                  {
                    vm.networkInterfaces?.[0]
                      ?.networkIP || "-"
                  }
                </td>

                <td>
                  {
                    vm.networkInterfaces?.[0]
                      ?.accessConfigs?.[0]
                      ?.natIP || "-"
                  }
                </td>

                <td>
                  <button
                    onClick={() =>
                      startVM(zone, vm.name)
                    }
                  >
                    Start
                  </button>

                  <button
                    onClick={() =>
                      stopVM(zone, vm.name)
                    }
                    style={{
                      marginLeft: 10
                    }}
                  >
                    Stop
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;