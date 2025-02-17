# Cozilla - AI Maintenance Assistant

<p align="center">
  <img src="https://i.imgur.com/5HrjqyP.png" alt="Imgur" width="100">
</p>

This project is a submission for the 2025 TSMC IT CareerHack competition, under the theme **AI Maintenance Assistant**. Our goal is to leverage AI technology to automate the transformation and optimization of code and architectures, helping enterprises dynamically adjust their IT environments to meet the needs of different regions as they expand globally, ensuring stable system operation.

## Origin of the Name

The name **Cozilla** is a combination of **Code** + **Gozilla**. Inspired by Godzilla, a creature known for surviving in the harshest environments—be it the deep sea or active volcanoes we envision our project enabling code to transform freely and adapt to a variety of environments, much like Godzilla adapts and thrives under extreme conditions.

## Project Overview

With the trend of global enterprise expansion, IT infrastructures in various regions must be tailored and built according to local conditions. This project proposes an automated mechanism that adjusts code and configurations during application or code deployment based on differences in the execution environment. The main features include:

- **Code Conversion Assistant**  
  Uses AI to identify compatibility issues in Java or Python during version conversion and perform automatic optimizations.
- **Automated Error Fixing and Testing**  
  Automatically repairs compilation errors and executes functional tests to ensure the accuracy and performance of the converted code.
- **Diverse Test Data Generation**  
  Utilizes LLM technology to generate multiple test cases, verifying the consistency of code output before and after conversion.
- **Performance Testing and Report Generation**  
  Constructs performance testing reports to evaluate the new code's performance across various metrics.
- **Automatic Deployment to GCP Kubernetes**  
  Automatically deploys the transformed code and configurations to a Kubernetes environment on Google Cloud Platform (GCP).

## System Architecture

![Imgur](https://i.imgur.com/qltHNgj.png)

- **transferCode**: Handles version conversion of code within the same language or across different languages.
- **retransferCode**: Generates diverse test cases using LLM to verify code consistency before and after conversion.
- **testCode**: Executes functional tests to ensure the proper operation of the code.
- **improvePerf**: Optimizes the code and evaluates its performance.
- **buildReport**: Generates performance testing reports to provide insights for further optimization.
- **fixCode**: Automatically repairs compilation errors.
- **buildEnv**: Adjusts code and configurations based on the execution environment.

## How to Run the Project

> **Warning:**
> The GCP platform used during the competition has been shut down, so the API functionality may not work properly.

### Front-end

1. Navigate to the front-end directory:

   ```bash
   cd frontend
   ```

2. Install the required dependencies:

   ```bash
   npm i
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### back-end

1. Navigate to the back-end directory:

   ```bash
   cd backend
   ```

2. Install the required dependencies:

   ```bash
   npm i
   ```

3. Start the server:
   ```bash
   npm start
   ```
