#
# VARIABLES
#
variable "project_id" {
  description = "Google project ID"
  type        = string
  default = "reminder-app-803e2"
}
variable "docker_image_tag" {
  description = "The tag of the Docker image to use"
  type        = string
}
variable "git_commit_sha" {
  description = "The git commit to use for deployment"
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

#
# TERRAFORM AND PROJECT SETUP
#

# Provider Configuration
provider "google" {
  project = var.project_id
  region  = "us-west1"
}

terraform {
  backend "gcs" {
    prefix = "terraform/state"
  }
}

#
# MAIN RESOURCES
#

resource "google_project_service" "enable_iam_api" {
  project = var.project_id
  service = "iam.googleapis.com"
  disable_on_destroy = false
}


resource "google_service_account" "runtime_service_account" {
  depends_on = [google_project_service.enable_iam_api] # Explicit dependency
  account_id   = "runtime-service-account"
  display_name = "Runtime Service Account"
}

resource "google_project_iam_member" "secret_accessor" {
  depends_on = [google_service_account.runtime_service_account]
  project = var.project_id
  role    = "roles/secretmanager.admin"
  member  = "serviceAccount:${google_service_account.runtime_service_account.email}"
}

resource "google_project_iam_member" "workload_identity_user" {
  depends_on = [google_service_account.runtime_service_account]
  project = var.project_id
  role    = "roles/iam.workloadIdentityUser"
  member  = "serviceAccount:${google_service_account.runtime_service_account.email}"
}


resource "google_project_service" "secret_manager" {
  project = var.project_id
  service = "secretmanager.googleapis.com"
  disable_dependent_services = true
}

resource "google_project_iam_member" "firebase_admin_access" {
  depends_on = [google_service_account.runtime_service_account]
  project = var.project_id
  role    = "roles/firebase.admin"
  member  = "serviceAccount:${google_service_account.runtime_service_account.email}"
}

#
# ADD SECRETS
#
resource "google_secret_manager_secret" "firebase_service_account_key" {
  depends_on = [google_project_iam_member.secret_accessor, google_project_service.secret_manager]
  project = var.project_id
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
  depends_on = [google_project_iam_member.secret_accessor]
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
  depends_on = [google_project_iam_member.secret_accessor]
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
  depends_on = [google_project_iam_member.secret_accessor]
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
  depends_on = [google_project_iam_member.secret_accessor]
  secret_id = "hash_secret"
  replication {
    auto {}
  }
}
resource "google_secret_manager_secret_version" "hash_secret_version" {
  secret      = google_secret_manager_secret.hash_secret.id
  secret_data = var.hash_secret
}

#
# COMPUTE RESOURCES
#

# Reserve a static external IP address
resource "google_compute_address" "static_ip" {
  name = "my-static-ip"
  region = "us-west1"
}

resource "google_project_service" "compute_api" {
  project = var.project_id
  service = "compute.googleapis.com"
}

# Create a single Compute Engine instance for Node.js
resource "google_compute_instance" "reminder_backend_instance" {
  depends_on = [google_project_service.compute_api]
  name         = "reminder-backend-vm"
  machine_type = "e2-micro"
  zone         = "us-west1-a"
  tags         = ["http-server"]

  service_account {
    email  = google_service_account.runtime_service_account.email
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
    git checkout ${var.git_commit_sha}
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

    # Ensure the required directories exist
    # sudo mkdir -p ./certbot/www ./nginx/certs /var/www/certbot
    sudo mkdir /home/reminder_backend/certificates
    sudo mkdir /home/reminder_backend/webroot
    sudo mkdir /home/reminder_backend/certbot
    sudo mkdir -p /var/www/certbot
    # sudo chmod -R 755 /var/www/certbot
    # sudo chown -R $(whoami):$(whoami) /var/www/certbot

    # Start Nginx and Certbot to initialize certificate generation
    echo "Starting Nginx and Certbot services..."
    docker-compose up -d nginx certbot

    # Obtain SSL certificate using Certbot
    echo "Obtaining SSL certificate..."
    if docker-compose run --rm certbot certonly --webroot -w /var/www/html -d rexni.com; then
        echo "Certificate obtained successfully."
    else
        echo "Certificate generation failed."
        exit 1
    fi

    # Restart Nginx to load SSL certificates
    echo "Restarting Nginx with SSL configuration..."
    docker-compose down
    docker-compose up -d nginx

    # Start the remaining services
    echo "Starting all services with Docker Compose..."
    if docker-compose up --build -d; then
        echo "All services started successfully."
    else
        echo "Docker Compose failed to start services."
        exit 1
    fi
  EOF

  network_interface {
    subnetwork = google_compute_subnetwork.my_compute_subnetwork.self_link
    access_config {
      # Include this section to give the VM an external IP address
      nat_ip = google_compute_address.static_ip.address
    }
  }
}

resource "google_compute_network" "virtual_private_cloud_network" {
  name                    = "virtualprivateclould-network"
  auto_create_subnetworks = false
  mtu                     = 1460
}

resource "google_compute_firewall" "allow_ssh" {
  name    = "allow-ssh"
  network = google_compute_network.virtual_private_cloud_network.self_link

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"] # Allow SSH from any IP (for testing purposes)
  # source_ranges = ["<your_ip_address>/32"] # Recommended: Restrict to your IP address
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
    ports    = ["443", "80"]
  }

  source_ranges = ["0.0.0.0/0"]
}


output "web_server_ip" {
  value = google_compute_address.static_ip.address
  description = "The static external IP address of the web server."
}

output "web_server_url_https" {
  value = "https://${google_compute_address.static_ip.address}/graphql"
  description = "The URL of the web service (HTTPS - served by Nginx)."
}
