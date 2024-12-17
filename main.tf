terraform {
  backend "gcs" {
    bucket = "reminders_bucket"
    prefix = "terraform/state"
  }
}

variable "project_id" {
  description = "Google project ID"
  type        = string
  default = "reminder-app-803e2"
}
variable "docker_image_tag" {
  description = "The tag of the Docker image to use"
  type        = string
}
variable "docker_username" {
  description = "Docker registry username"
  type        = string
  sensitive   = true
}
variable "docker_password" {
  description = "Docker registry password"
  type        = string
  sensitive   = true
}
variable "docker_access_token" {
  description = "Docker registry access token"
  type        = string
  sensitive   = true
}

variable "firebase_service_account_key" {
  description = "firebase_service_account_key"
  type        = string
  sensitive   = true
}

variable "hash_secret" {
  description = "hash_secret"
  type        = string
  sensitive   = true
}


provider "google" {
  project = var.project_id
  region  = "us-west1"
}

resource "google_project_service" "iam_api" {
  service            = "iam.googleapis.com"
  disable_on_destroy = false
}

resource "google_service_account" "terraform_service_account" {
  account_id   = "terraform-service-account"
  display_name = "Terraform Service Account"
}

resource "google_project_iam_member" "secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.terraform_service_account.email}"
}

resource "google_project_iam_member" "workload_identity_user" {
  project = var.project_id
  role    = "roles/iam.workloadIdentityUser"
  member  = "serviceAccount:${google_service_account.terraform_service_account.email}"
}


resource "google_project_service" "secret_manager" {
  service = "secretmanager.googleapis.com"

  disable_dependent_services = true
}

resource "google_secret_manager_secret" "firebase_service_account_key" {
  secret_id = "firebase_service_account_key"
  replication {
    auto {}
  }
}
resource "google_secret_manager_secret_version" "firebase_service_account_key_version" {
  secret      = google_secret_manager_secret.firebase_service_account_key.id
  secret_data = var.firebase_service_account_key
}

resource "google_secret_manager_secret" "docker_password" {
  secret_id = "docker_password"
  replication {
    auto {}
  }
}
resource "google_secret_manager_secret_version" "docker_password_version" {
  secret      = google_secret_manager_secret.docker_password.id
  secret_data = var.docker_password
}

resource "google_secret_manager_secret" "docker_username" {
  secret_id = "docker_username"
  replication {
    auto {}
  }
}
resource "google_secret_manager_secret_version" "docker_username_version" {
  secret      = google_secret_manager_secret.docker_username.id
  secret_data = var.docker_username
}


resource "google_secret_manager_secret" "docker_access_token" {
  secret_id = "docker_access_token"
  replication {
    auto {}
  }
}
resource "google_secret_manager_secret_version" "docker_access_token_version" {
  secret      = google_secret_manager_secret.docker_access_token.id
  secret_data = var.docker_access_token
}

resource "google_secret_manager_secret" "hash_secret" {
  secret_id = "hash_secret"
  replication {
    auto {}
  }
}
resource "google_secret_manager_secret_version" "hash_secret_version" {
  secret      = google_secret_manager_secret.hash_secret.id
  secret_data = var.hash_secret
}

# Create a single Compute Engine instance for Node.js
resource "google_compute_instance" "reminder_backend_instance" {
  name         = "reminder-backend-vm"
  machine_type = "e2-micro"
  zone         = "us-west1-a"
  tags         = ["http-server"]

  service_account {
    email  = google_service_account.terraform_service_account.email
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2004-lts"
    }
  }

  # Install Node.js and your Node.js project
  metadata_startup_script = <<-EOF
    #!/bin/bash
    set -e

    # Update the package lists and install required packages
    sudo apt-get update
    sudo apt-get install -yq \
        apt-transport-https \
        ca-certificates \
        curl \
        software-properties-common

    echo "INSTALL DOCKER"

    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker ubuntu

    echo "START DOCKER"

    # Start the Docker service (add this line)
    #sudo service docker start

    echo "INSTALL DOCKER-COMPOSE"

    # Install Docker-Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

    # Check the version of Docker Compose to ensure it's installed correctly
    docker-compose version

    # Use the Docker image tag passed from Terraform
    export DOCKER_IMAGE_TAG=${var.docker_image_tag}

    echo "CLONE REPO"
    # Pull the Docker Compose project from a repository (e.g., Git)
    if [ -d /home/reminder_backend ]; then
      cd /home/reminder_backend
      git pull
    else
      git clone https://github.com/lucasahli/reminder_backend.git /home/reminder_backend
    fi

    cd /home/reminder_backend
    sudo mkdir /home/reminder_backend/redis_data

    # Modify the docker-compose.yml file to use the image tag
    # This assumes you have a placeholder in your docker-compose.yml like <IMAGE_TAG>
    sed -i "s/<IMAGE_TAG>/$DOCKER_IMAGE_TAG/g" docker-compose.yml

    echo "DOCKER LOGIN"
    # Retrieve the Docker username from Secret Manager
    export DOCKER_USERNAME=$(gcloud secrets versions access latest --secret="docker_username" --project="${var.project_id}" --format='get(payload.data)' | tr -d '\n' | base64 --decode)
    export DOCKER_ACCESS_TOKEN=$(gcloud secrets versions access latest --secret="docker_access_token" --project="${var.project_id}" --format='get(payload.data)' | tr -d '\n' | base64 --decode)
    export HASH_SECRET=$(gcloud secrets versions access latest --secret="hash_secret" --project="${var.project_id}" --format='get(payload.data)' | tr -d '\n' | base64 --decode)
    export FIREBASE_SERVICE_ACCOUNT_KEY=$(gcloud secrets versions access latest --secret="firebase_service_account_key" --project="${var.project_id}" --format='get(payload.data)' | tr -d '\n' | base64 --decode)

    # Use the retrieved username in your script
    echo "Docker username: $${DOCKER_USERNAME}"


    # Check if variables are retrieved successfully
    if [ -z "$${DOCKER_USERNAME}" ] || [ -z "$${DOCKER_ACCESS_TOKEN}" ]; then
        echo "Docker credentials not found in instance metadata."
        exit 1
    fi

    # Docker login
    echo "DOCKER LOGIN"
    echo "Using username: $${DOCKER_USERNAME}"
    if echo "$${DOCKER_ACCESS_TOKEN}" | docker login -u "$${DOCKER_USERNAME}" --password-stdin docker.io; then
        echo "Docker login successful."
    else
        echo "Docker login failed."
        exit 1
    fi

    echo "START DOCKER-COMPOSE"
    # Start your Docker Compose project
    if docker-compose up --build -d; then
        echo "STARTED DOCKER-COMPOSE"
    else
        echo "DOCKER-COMPOSE failed to start."
        exit 1
    fi
  EOF

  network_interface {
    network = google_compute_network.virtual_private_cloud_network.self_link
    subnetwork = google_compute_subnetwork.my_compute_subnetwork.self_link
    access_config {
      # Include this section to give the VM an external IP address
    }
  }
}

resource "google_compute_network" "virtual_private_cloud_network" {
  name                    = "virtualprivateclould-network"
  auto_create_subnetworks = false
  mtu                     = 1460
}

resource "google_compute_subnetwork" "my_compute_subnetwork" {
  name          = "my-compute-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region        = "us-west1"
  network       = google_compute_network.virtual_private_cloud_network.id
}

resource "google_compute_firewall" "allow_internal" {
  name    = "allow-internal"
  network = google_compute_network.virtual_private_cloud_network.self_link

  allow {
    protocol = "tcp"
    ports    = ["6379", "4000"]
  }

  source_ranges = ["10.128.0.0/9"]
}

resource "google_compute_firewall" "allow_external" {
  name    = "allow-external"
  network = google_compute_network.virtual_private_cloud_network.self_link

  allow {
    protocol = "tcp"
    ports    = ["4000"]
  }

  source_ranges = ["0.0.0.0/0"]
}


# Create a firewall rule to allow incoming HTTP (port 80) traffic
#resource "google_compute_firewall" "allow-http" {
#  name    = "allow-http"
#  network = google_compute_network.vpc_network.self_link
#
#  allow {
#    protocol = "tcp"
#    ports    = ["4000"]
#  }
#
#  source_ranges = ["0.0.0.0/0"]
#  target_tags   = ["http-server"]
#}

// A variable for extracting the external IP address of the VM
output "Web-server-URL" {
 value = "http://${google_compute_instance.reminder_backend_instance.network_interface.0.access_config.0.nat_ip}:4000/graphql"
}
