#!/bin/bash
gcloud container clusters get-credentials careerhack-cluster-tsid --zone us-central1-a --project tsmccareerhack2025-tsid-grp2
kubectl apply -f /home/tsid_user06_tsmc_hackathon_cloud/Cozilla/backend/routes/generated_yaml.yaml
gcloud builds submit --tag us-central1-docker.pkg.dev/tsmccareerhack2025-tsid-grp2/repo-name/cloudrun-app
gcloud run deploy cloudrun-app --image us-central1-docker.pkg.dev/tsmccareerhack2025-tsid-grp2/repo-name/cloudrun-app --platform managed --region us-central1 --allow-unauthenticated
