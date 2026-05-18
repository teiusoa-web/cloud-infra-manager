const API_URL = "http://127.0.0.1:8000";

export async function listVMs() {
  const res = await fetch(`${API_URL}/vms/`);
  return res.json();
}

export async function createVM(data) {
  const res = await fetch(`${API_URL}/vms/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function startVM(zone, name) {
  const res = await fetch(`${API_URL}/vms/${zone}/${name}/start`, {
    method: "POST",
  });
  return res.json();
}

export async function stopVM(zone, name) {
  const res = await fetch(`${API_URL}/vms/${zone}/${name}/stop`, {
    method: "POST",
  });
  return res.json();
}

export async function resetVM(zone, name) {
  const res = await fetch(`${API_URL}/vms/${zone}/${name}/reset`, {
    method: "POST",
  });
  return res.json();
}

export async function deleteVM(zone, name) {
  const res = await fetch(`${API_URL}/vms/${zone}/${name}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function pulumiPreview() {
  const res = await fetch(`${API_URL}/infra/preview`);
  return res.json();
}

export async function pulumiUp() {
  const res = await fetch(`${API_URL}/infra/up`, {
    method: "POST",
  });
  return res.json();
}

export async function pulumiDestroy() {
  const res = await fetch(`${API_URL}/infra/destroy`, {
    method: "POST",
  });
  return res.json();
}

export async function pulumiOutputs() {
  const res = await fetch(`${API_URL}/infra/outputs`);
  return res.json();
}