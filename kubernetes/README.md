# Movie App Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the Movie App with PostgreSQL database, backend API, and frontend React application.

## Architecture

- **Namespace**: `app`
- **Database**: PostgreSQL 15 with persistent storage
- **Backend**: Node.js API (port 5000)
- **Frontend**: React application (port 3000)
- **Ingress**: Nginx ingress for external access

## Prerequisites

1. Kubernetes cluster with ingress controller (nginx)
2. Docker images available locally:
   - `movie2-backend:latest`
   - `movie2-frontend:latest`
   - `postgres:15`

## Image Import for K3s

Since K3s uses containerd, you need to import your local Docker images:

```bash
# Save Docker images to tar files
docker save movie2-backend:latest -o /tmp/backend.tar
docker save movie2-frontend:latest -o /tmp/frontend.tar

# Import into K3s containerd
sudo ctr -n k8s.io images import /tmp/backend.tar
sudo ctr -n k8s.io images import /tmp/frontend.tar

# Clean up
rm /tmp/backend.tar /tmp/frontend.tar
```

**Alternative: Use Local Registry**
If you prefer using a local registry, see the `registry/` directory for setup instructions.

## Deployment Order

Deploy the resources in the following order:

```bash
# 1. Create namespace
kubectl apply -f namespace.yaml

# 2. Create secrets and configs
kubectl apply -f secrets/
kubectl apply -f config/

# 3. Deploy database
kubectl apply -f db/

# 4. Deploy backend
kubectl apply -f backend/

# 5. Deploy frontend
kubectl apply -f frontend/

# 6. Deploy ingress
kubectl apply -f ingress.yaml
```

## Quick Deploy

To deploy everything at once:

```bash
kubectl apply -f .
```

## Accessing the Application

After deployment, you can access the application at:
- Frontend: `http://movie-app.local`
- Backend API: `http://movie-app.local/api`

To access locally, add this to your `/etc/hosts` file:
```
127.0.0.1 movie-app.local
```

## Database Configuration

- **Database Name**: `movie_db`
- **Username**: `postgres`
- **Password**: `postgres`
- **Host**: `postgres-service`
- **Port**: `5432`

The database initialization script is loaded via ConfigMap from `config/db-init-configmap.yaml`.

## Scaling

To scale the application:

```bash
# Scale backend
kubectl scale deployment backend-deployment --replicas=3 -n app

# Scale frontend
kubectl scale deployment frontend-deployment --replicas=3 -n app
```

## Monitoring

Check the status of your deployments:

```bash
kubectl get pods -n app
kubectl get services -n app
kubectl get ingress -n app
```

## Troubleshooting

1. Check pod logs:
   ```bash
   kubectl logs -f deployment/backend-deployment -n app
   kubectl logs -f deployment/frontend-deployment -n app
   kubectl logs -f deployment/postgres-deployment -n app
   ```

2. Check service endpoints:
   ```bash
   kubectl get endpoints -n app
   ```

3. Check ingress status:
   ```bash
   kubectl describe ingress movie-app-ingress -n app
   ```

## Cleanup

To remove all resources:

```bash
kubectl delete -f .
```
