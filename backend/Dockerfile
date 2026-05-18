FROM python:3.12-slim

WORKDIR /app

# System packages
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    gnupg \
    apt-transport-https \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Google Cloud SDK
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" \
    | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg \
    | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg

RUN apt-get update && apt-get install -y google-cloud-cli

# Install Pulumi
RUN pip install --no-cache-dir pulumi pulumi-gcp
RUN curl -fsSL https://get.pulumi.com | sh

ENV PATH="/root/.pulumi/bin:${PATH}"

# Python deps
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

EXPOSE 8000

RUN mkdir -p /tmp/pulumi && \
    /root/.pulumi/bin/pulumi login file:///tmp/pulumi

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]