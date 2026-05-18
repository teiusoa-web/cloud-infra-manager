"""A Google Cloud Python Pulumi program"""

import pulumi
import pulumi_gcp as gcp

# Create a GCP resource (Storage Bucket)
vm = gcp.compute.Instance(
    "vm-instance",

    machine_type="e2-micro",
    zone="asia-southeast1-a",

    boot_disk={
        "initialize_params": {
            "image": "debian-cloud/debian-12"
        }
    },

    network_interfaces=[{
        "network": "default",
        "access_configs": [{}]
    }]
)

# Export the DNS name of the bucket
pulumi.export(
    "vm_ip",
    vm.network_interfaces[0]
    .access_configs[0]
    .nat_ip
)
