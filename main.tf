terraform {
  backend "gcs" {
    bucket = "reminders_bucket"
    prefix = "terraform/state"
  }
}

variable "docker_image_tag" {
  description = "The tag of the Docker image to use"
  type        = string
}

resource "google_compute_network" "vpc_network" {
  name                    = "my-custom-mode-network"
  auto_create_subnetworks = false
  mtu                     = 1460
}

resource "google_compute_subnetwork" "default" {
  name          = "my-custom-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region        = "us-west1"
  network       = google_compute_network.vpc_network.id
}

# Create a single Compute Engine instance for Node.js
resource "google_compute_instance" "reminder_backend" {
  name         = "reminder-backend-vm"
  machine_type = "e2-micro"
  zone         = "us-west1-a"
  tags         = ["http-server"]
  metadata = {
    # Use the variable like this
    docker_image_tag = var.docker_image_tag
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
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

    # Check the version of Docker Compose to ensure it's installed correctly
    docker-compose version

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

    # Use the Docker image tag passed from Terraform
    export DOCKER_IMAGE_TAG=${var.docker_image_tag}

    # Modify the docker-compose.yml file to use the image tag
    # This assumes you have a placeholder in your docker-compose.yml like <IMAGE_TAG>
    sed -i "s/<IMAGE_TAG>/$DOCKER_IMAGE_TAG/g" docker-compose.yml

    echo "START DOCKER-Compose"
    # Start your Docker Compose project
    docker-compose up --build -d
    echo "STARTED DOCKER-COMPOSE"
  EOF

  network_interface {
    subnetwork = google_compute_subnetwork.default.self_link

    access_config {
      # Include this section to give the VM an external IP address
    }
  }
}

# Create a firewall rule to allow incoming HTTP (port 80) traffic
resource "google_compute_firewall" "allow-http" {
  name    = "allow-http"
  network = google_compute_network.vpc_network.self_link

  allow {
    protocol = "tcp"
    ports    = ["4000"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
}

// A variable for extracting the external IP address of the VM
output "Web-server-URL" {
 value = "http://${google_compute_instance.reminder_backend.network_interface.0.access_config.0.nat_ip}:4000/graphql"
}
