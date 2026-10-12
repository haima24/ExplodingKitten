# Comprehensive Draw.io Architecture Diagram Generation Guideline

## Purpose
This document provides detailed instructions for generating professional, enterprise-grade high-level architecture diagrams in Draw.io XML format using official cloud provider icons (Azure, AWS, and GCP).

---

## Table of Contents
1. [Draw.io XML File Structure](#1-drawio-xml-file-structure)
2. [Cloud Provider Icon Libraries](#2-cloud-provider-icon-libraries)
3. [Icon Style Syntax Reference](#3-icon-style-syntax-reference)
4. [Layout and Positioning Guidelines](#4-layout-and-positioning-guidelines)
5. [Visual Design Standards](#5-visual-design-standards)
6. [Component Grouping and Zones](#6-component-grouping-and-zones)
7. [Connection and Arrow Styles](#7-connection-and-arrow-styles)
8. [Legend and Annotation Standards](#8-legend-and-annotation-standards)
9. [Complete Icon Reference Catalog](#9-complete-icon-reference-catalog)
10. [XML Code Templates](#10-xml-code-templates)
11. [Best Practices Checklist](#11-best-practices-checklist)

---

## 1. Draw.io XML File Structure

### Basic XML Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" agent="Mozilla/5.0" version="28.1.1">
  <diagram name="Architecture-Diagram" id="unique-diagram-id">
    <mxGraphModel dx="1800" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="1200" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- All diagram elements go here -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### Key Attributes Explained
| Attribute | Description | Recommended Value |
|-----------|-------------|-------------------|
| `dx` | Canvas width offset | 1800 (large diagrams) |
| `dy` | Canvas height offset | 1200 (large diagrams) |
| `grid` | Show grid | 1 (enabled) |
| `gridSize` | Grid cell size in pixels | 10 |
| `pageWidth` | Page width in pixels | 1600 (landscape) |
| `pageHeight` | Page height in pixels | 1200 (landscape) |

---

## 2. Cloud Provider Icon Libraries

### Azure Icons (img/lib/azure2/)
Azure icons are organized into the following categories:

| Category Path | Description | Common Icons |
|--------------|-------------|--------------|
| `img/lib/azure2/general/` | General Azure icons | Browser, Code, Management_Groups, Subscriptions, Resource_Groups |
| `img/lib/azure2/compute/` | Compute services | Virtual_Machine, App_Services, Container_Instances, Kubernetes_Services |
| `img/lib/azure2/networking/` | Networking | Virtual_Networks, Load_Balancers, Application_Gateway, DNS_Zones, CDN_Profiles |
| `img/lib/azure2/databases/` | Database services | SQL_Database, Cosmos_DB, MySQL_Database, PostgreSQL |
| `img/lib/azure2/storage/` | Storage | Blob_Storage, File_Storage, Queue_Storage, Table_Storage |
| `img/lib/azure2/security/` | Security | Key_Vaults, Azure_Sentinel, Defender_for_Cloud |
| `img/lib/azure2/identity/` | Identity | Azure_Active_Directory, Managed_Identities |
| `img/lib/azure2/integration/` | Integration | API_Management, Service_Bus, Event_Grid, Logic_Apps |
| `img/lib/azure2/management_governance/` | Management | Application_Insights, Log_Analytics_Workspaces, Monitor |
| `img/lib/azure2/iot/` | IoT services | Function_Apps, IoT_Hub |
| `img/lib/azure2/containers/` | Container services | Container_Registries, Container_Apps |
| `img/lib/azure2/app_services/` | App Services | App_Services, App_Service_Plans |
| `img/lib/azure2/devops/` | DevOps | Azure_DevOps, Pipelines, Repos |
| `img/lib/azure2/ai_machine_learning/` | AI/ML | Cognitive_Services, Machine_Learning |
| `img/lib/azure2/analytics/` | Analytics | Synapse_Analytics, Data_Factory |

### AWS Icons (mxgraph.aws4.)
AWS icons use a different syntax with `shape=mxgraph.aws4.resourceIcon` and `resIcon=mxgraph.aws4.[service_name]`:

| Category | Common Service Names |
|----------|---------------------|
| Compute | ec2, lambda, ecs, eks, fargate, batch |
| Networking | vpc, route_53, cloudfront, api_gateway, elastic_load_balancing, direct_connect |
| Database | rds, dynamodb, aurora, elasticache, redshift, neptune |
| Storage | s3, ebs, efs, glacier, storage_gateway |
| Security | iam, cognito, secrets_manager, kms, waf, shield |
| Integration | sqs, sns, eventbridge, step_functions, mq |
| Management | cloudwatch, cloudtrail, systems_manager, config |
| Analytics | kinesis, athena, emr, glue, quicksight |
| AI/ML | sagemaker, comprehend, rekognition, lex |

### GCP Icons (img/lib/google/)
GCP icons are organized by service category:

| Category Path | Description |
|--------------|-------------|
| `img/lib/google/compute/` | Compute Engine, Cloud Functions, GKE |
| `img/lib/google/networking/` | VPC, Cloud Load Balancing, Cloud DNS |
| `img/lib/google/database/` | Cloud SQL, Firestore, Bigtable, Spanner |
| `img/lib/google/storage/` | Cloud Storage |
| `img/lib/google/security/` | Cloud IAM, Secret Manager |
| `img/lib/google/management/` | Cloud Monitoring, Cloud Logging |

---

## 3. Icon Style Syntax Reference

### Azure Icon Style
```
style="image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/[category]/[IconName].svg;"
```

**Complete Example:**
```xml
<mxCell id="azure-vm-1" value="Web Server" 
  style="image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/compute/Virtual_Machine.svg;" 
  vertex="1" parent="1">
  <mxGeometry x="200" y="300" width="65" height="52" as="geometry" />
</mxCell>
```

### AWS Icon Style
```
style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#8C4FFF;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.[service_name];"
```

**Complete Example:**
```xml
<mxCell id="aws-ec2-1" value="EC2 Instance"
  style="sketch=0;points=[[0,0,0],[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0,0],[0,1,0],[0.25,1,0],[0.5,1,0],[0.75,1,0],[1,1,0],[0,0.25,0],[0,0.5,0],[0,0.75,0],[1,0.25,0],[1,0.5,0],[1,0.75,0]];outlineConnect=0;fontColor=#232F3E;fillColor=#ED7100;strokeColor=#ffffff;dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.ec2;"
  vertex="1" parent="1">
  <mxGeometry x="200" y="300" width="78" height="78" as="geometry" />
</mxCell>
```

### AWS Fill Colors by Category
| Category | Fill Color |
|----------|-----------|
| Compute | #ED7100 |
| Networking | #8C4FFF |
| Database | #3334B9 |
| Storage | #7AA116 |
| Security | #DD344C |
| Analytics | #8C4FFF |
| Management | #E7157B |
| Application Integration | #E7157B |

### GCP Icon Style
```
style="image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/google/[category]/[icon_name].svg;"
```

---

## 4. Layout and Positioning Guidelines

### Coordinate System
- Origin (0,0) is at top-left corner
- X increases to the right
- Y increases downward
- Standard icon size: width=65, height=52 (Azure) or width=78, height=78 (AWS)

### Zone-Based Layout Structure
```
+------------------------------------------------------------------+
|  Y=50-150   |  EXTERNAL USERS / INTERNET ZONE                    |
+------------------------------------------------------------------+
|  Y=180-280  |  EDGE/DMZ ZONE (CDN, WAF, Load Balancers)          |
+------------------------------------------------------------------+
|  Y=310-500  |  APPLICATION ZONE (Frontend, Backend Services)     |
+------------------------------------------------------------------+
|  Y=530-700  |  DATA ZONE (Databases, Storage, Cache)             |
+------------------------------------------------------------------+
|  Y=730-900  |  INTEGRATION ZONE (External Systems, APIs)         |
+------------------------------------------------------------------+
|  X=50-200   |  X=220-400  |  X=420-600  |  X=620-800  |  X=820+  |
```

### Standard Spacing
| Element Type | Recommended Spacing |
|-------------|---------------------|
| Icons within zone | 80-120px horizontal gap |
| Zone containers | 30px margin, 20px padding |
| Labels | 10px below icon |
| Connection endpoints | Snap to grid (10px increments) |

### Multi-Zone Architecture Layout
```
X Positions for 3-Zone Deployment:
- Zone A: X = 150-350
- Zone B: X = 400-600  
- Zone C: X = 650-850

Y Positions:
- User Layer: Y = 80
- Load Balancer: Y = 180
- Application: Y = 320
- Database: Y = 500
- External Integration: Y = 680
```

---

## 5. Visual Design Standards

### Color Coding Schema
| Scope Type | Color | Hex Code | Use Case |
|-----------|-------|----------|----------|
| In Scope (New) | Orange | #FF6B35 | Components being developed |
| Existing Systems | Blue | #74B9FF | Legacy/existing infrastructure |
| External/3rd Party | Green | #00B894 | External services, APIs |
| Security Controls | Yellow | #FDCB6E | Security boundaries |
| Data Services | Purple | #A29BFE | Databases, storage |
| Critical/High-Priority | Red | #E17055 | High-security components |

### Container/Group Styles

**Security Zone Container:**
```xml
<mxCell id="zone-1" value="Production Environment"
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;dashed=1;dashPattern=5 5;verticalAlign=top;fontStyle=1;fontSize=14;"
  vertex="1" parent="1">
  <mxGeometry x="100" y="250" width="600" height="400" as="geometry" />
</mxCell>
```

**Availability Zone Container:**
```xml
<mxCell id="az-1" value="Availability Zone A"
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;dashed=0;verticalAlign=top;fontStyle=1;fontSize=12;"
  vertex="1" parent="1">
  <mxGeometry x="120" y="280" width="180" height="350" as="geometry" />
</mxCell>
```

### Font Standards
| Element | Font Size | Font Style |
|---------|-----------|------------|
| Diagram Title | 18-20px | Bold |
| Zone Labels | 14-16px | Bold |
| Component Labels | 12px | Normal |
| Technical Details | 10px | Normal/Italic |
| Legend Items | 10-11px | Normal |

---

## 6. Component Grouping and Zones

### Standard Architecture Zones

#### 1. External/Internet Zone
- Users, browsers, mobile clients
- External systems
- Internet boundary

#### 2. Edge/Perimeter Zone
- CDN (Content Delivery Network)
- WAF (Web Application Firewall)
- DDoS Protection
- API Gateway
- Load Balancers

#### 3. Application Zone
- Frontend applications
- Backend services/APIs
- Microservices
- Container orchestration
- Service mesh

#### 4. Data Zone
- Relational databases
- NoSQL databases
- Cache services
- Object storage
- Message queues

#### 5. Management Zone
- Monitoring & logging
- CI/CD pipelines
- Key management
- Identity services
- Backup services

#### 6. Integration Zone
- External API connections
- Legacy system interfaces
- Third-party services
- B2B connections

### Group Hierarchy Example
```xml
<!-- Parent Security Boundary -->
<mxCell id="security-boundary" value="Azure Subscription"
  style="swimlane;startSize=25;fillColor=#E6E6E6;strokeColor=#333333;"
  vertex="1" parent="1">
  <mxGeometry x="50" y="50" width="900" height="700" as="geometry" />
</mxCell>

<!-- Child: Application Zone -->
<mxCell id="app-zone" value="Application Zone"
  style="swimlane;startSize=20;fillColor=#DAE8FC;strokeColor=#6C8EBF;"
  vertex="1" parent="security-boundary">
  <mxGeometry x="20" y="40" width="400" height="300" as="geometry" />
</mxCell>

<!-- Grandchild: Individual Service -->
<mxCell id="web-app" value="Web App"
  style="image;aspect=fixed;html=1;points=[];align=center;fontSize=12;image=img/lib/azure2/app_services/App_Services.svg;"
  vertex="1" parent="app-zone">
  <mxGeometry x="50" y="50" width="65" height="52" as="geometry" />
</mxCell>
```

---

## 7. Connection and Arrow Styles

### Line Styles

**Primary Data Flow (Solid):**
```xml
<mxCell id="conn-1" value=""
  style="endArrow=blockThin;endFill=1;html=1;rounded=0;strokeWidth=2;strokeColor=#0066CC;"
  edge="1" parent="1" source="source-id" target="target-id">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

**Secondary/Async Flow (Dashed):**
```xml
<mxCell id="conn-2" value=""
  style="endArrow=blockThin;endFill=1;html=1;dashed=1;dashPattern=5 5;strokeWidth=2;strokeColor=#666666;"
  edge="1" parent="1" source="source-id" target="target-id">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

**Bidirectional Communication:**
```xml
<mxCell id="conn-3" value=""
  style="endArrow=blockThin;startArrow=blockThin;endFill=1;startFill=1;html=1;rounded=0;strokeWidth=2;strokeColor=#0066CC;"
  edge="1" parent="1" source="source-id" target="target-id">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

### Connection Labels
```xml
<mxCell id="conn-label" value="HTTPS/443"
  style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];fontSize=10;fontColor=#666666;"
  vertex="1" connectable="0" parent="conn-1">
  <mxGeometry x="0.5" relative="1" as="geometry">
    <mxPoint as="offset" />
  </mxGeometry>
</mxCell>
```

### Arrow/Connection Types
| Type | Style Properties | Use Case |
|------|-----------------|----------|
| User Traffic | strokeColor=#0066CC;strokeWidth=2 | HTTPS requests |
| API Calls | strokeColor=#00AA00;strokeWidth=2 | REST/GraphQL |
| Database | strokeColor=#9933FF;strokeWidth=2 | SQL connections |
| Monitoring | strokeColor=#FF9900;strokeWidth=1;dashed=1 | Logs, metrics |
| Management | strokeColor=#888888;strokeWidth=1;dashed=1 | Admin traffic |
| Security | strokeColor=#DD0000;strokeWidth=2 | Auth flows |

---

## 8. Legend and Annotation Standards

### Legend Template
```xml
<!-- Legend Container -->
<mxCell id="legend-container" value="Legend"
  style="swimlane;startSize=23;fillColor=#FFFFFF;strokeColor=#000000;fontStyle=1;"
  vertex="1" parent="1">
  <mxGeometry x="1050" y="50" width="200" height="300" as="geometry" />
</mxCell>

<!-- Legend Item: In Scope -->
<mxCell id="legend-scope" value=""
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FF6B35;strokeColor=#CC5500;"
  vertex="1" parent="legend-container">
  <mxGeometry x="10" y="35" width="30" height="20" as="geometry" />
</mxCell>
<mxCell id="legend-scope-label" value="In Scope (New)"
  style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=11;"
  vertex="1" parent="legend-container">
  <mxGeometry x="50" y="35" width="140" height="20" as="geometry" />
</mxCell>

<!-- Legend Item: Existing -->
<mxCell id="legend-existing" value=""
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#74B9FF;strokeColor=#5599DD;"
  vertex="1" parent="legend-container">
  <mxGeometry x="10" y="65" width="30" height="20" as="geometry" />
</mxCell>
<mxCell id="legend-existing-label" value="Existing Systems"
  style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=11;"
  vertex="1" parent="legend-container">
  <mxGeometry x="50" y="65" width="140" height="20" as="geometry" />
</mxCell>

<!-- Legend Item: External -->
<mxCell id="legend-external" value=""
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#00B894;strokeColor=#009977;"
  vertex="1" parent="legend-container">
  <mxGeometry x="10" y="95" width="30" height="20" as="geometry" />
</mxCell>
<mxCell id="legend-external-label" value="External/3rd Party"
  style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=11;"
  vertex="1" parent="legend-container">
  <mxGeometry x="50" y="95" width="140" height="20" as="geometry" />
</mxCell>

<!-- Data Flow Legend -->
<mxCell id="legend-flow-primary" value=""
  style="endArrow=blockThin;endFill=1;html=1;strokeWidth=2;strokeColor=#0066CC;"
  edge="1" parent="legend-container">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="10" y="140" as="sourcePoint" />
    <mxPoint x="40" y="140" as="targetPoint" />
  </mxGeometry>
</mxCell>
<mxCell id="legend-flow-primary-label" value="Primary Data Flow"
  style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=11;"
  vertex="1" parent="legend-container">
  <mxGeometry x="50" y="130" width="140" height="20" as="geometry" />
</mxCell>
```

### Architecture Notes Panel
```xml
<!-- Notes Panel -->
<mxCell id="notes-panel" value="Architecture Notes"
  style="swimlane;startSize=23;fillColor=#FFF2CC;strokeColor=#D6B656;fontStyle=1;"
  vertex="1" parent="1">
  <mxGeometry x="1050" y="370" width="200" height="250" as="geometry" />
</mxCell>

<mxCell id="notes-content" value="&lt;b&gt;Performance:&lt;/b&gt;&lt;br&gt;• CCU: TBD&lt;br&gt;• Response: &lt;2s&lt;br&gt;&lt;br&gt;&lt;b&gt;Security:&lt;/b&gt;&lt;br&gt;• TLS 1.3&lt;br&gt;• Zero Trust&lt;br&gt;&lt;br&gt;&lt;b&gt;Availability:&lt;/b&gt;&lt;br&gt;• Multi-AZ&lt;br&gt;• 99.9% SLA"
  style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=top;fontSize=10;spacingLeft=5;spacingTop=5;"
  vertex="1" parent="notes-panel">
  <mxGeometry x="5" y="30" width="190" height="210" as="geometry" />
</mxCell>
```

---

## 9. Complete Icon Reference Catalog

### Azure Icons - Full Path Reference

#### Compute Services
```
img/lib/azure2/compute/Virtual_Machine.svg
img/lib/azure2/compute/Virtual_Machine_Scale_Set.svg
img/lib/azure2/compute/Availability_Sets.svg
img/lib/azure2/compute/Disk.svg
img/lib/azure2/compute/Function_Apps.svg
img/lib/azure2/compute/App_Services.svg
img/lib/azure2/compute/Batch_Accounts.svg
```

#### Containers
```
img/lib/azure2/containers/Kubernetes_Services.svg
img/lib/azure2/containers/Container_Instances.svg
img/lib/azure2/containers/Container_Registries.svg
img/lib/azure2/containers/Container_Apps.svg
```

#### Networking
```
img/lib/azure2/networking/Virtual_Networks.svg
img/lib/azure2/networking/Load_Balancers.svg
img/lib/azure2/networking/Application_Gateway.svg
img/lib/azure2/networking/Virtual_Network_Gateways.svg
img/lib/azure2/networking/DNS_Zones.svg
img/lib/azure2/networking/Traffic_Manager_Profiles.svg
img/lib/azure2/networking/CDN_Profiles.svg
img/lib/azure2/networking/Front_Door_and_CDN_Profiles.svg
img/lib/azure2/networking/Firewall.svg
img/lib/azure2/networking/NAT.svg
img/lib/azure2/networking/Bastion.svg
img/lib/azure2/networking/Private_Link.svg
img/lib/azure2/networking/ExpressRoute_Circuits.svg
img/lib/azure2/networking/VPN_Gateways.svg
```

#### Databases
```
img/lib/azure2/databases/SQL_Database.svg
img/lib/azure2/databases/SQL_Server.svg
img/lib/azure2/databases/Azure_Cosmos_DB.svg
img/lib/azure2/databases/Cache_Redis.svg
img/lib/azure2/databases/Azure_Database_MySQL_Server.svg
img/lib/azure2/databases/Azure_Database_PostgreSQL_Server.svg
img/lib/azure2/databases/SQL_Managed_Instance.svg
```

#### Storage
```
img/lib/azure2/storage/Storage_Accounts.svg
img/lib/azure2/storage/Blob_Storage.svg
img/lib/azure2/storage/Queue_Storage.svg
img/lib/azure2/storage/Table_Storage.svg
img/lib/azure2/storage/File_Storage.svg
img/lib/azure2/storage/Data_Lake_Storage.svg
```

#### Security & Identity
```
img/lib/azure2/identity/Azure_Active_Directory.svg
img/lib/azure2/identity/Managed_Identities.svg
img/lib/azure2/identity/App_Registrations.svg
img/lib/azure2/security/Key_Vaults.svg
img/lib/azure2/security/Application_Security_Groups.svg
img/lib/azure2/security/Defender_for_Cloud.svg
img/lib/azure2/security/Azure_Sentinel.svg
```

#### Integration
```
img/lib/azure2/integration/API_Management.svg
img/lib/azure2/integration/Service_Bus.svg
img/lib/azure2/integration/Event_Grid_Domains.svg
img/lib/azure2/integration/Event_Hubs.svg
img/lib/azure2/integration/Logic_Apps.svg
img/lib/azure2/integration/Integration_Service_Environments.svg
```

#### Management & Governance
```
img/lib/azure2/management_governance/Monitor.svg
img/lib/azure2/management_governance/Application_Insights.svg
img/lib/azure2/management_governance/Log_Analytics_Workspaces.svg
img/lib/azure2/management_governance/Automation_Accounts.svg
img/lib/azure2/management_governance/Policy.svg
img/lib/azure2/management_governance/Cost_Management.svg
img/lib/azure2/management_governance/Blueprints.svg
```

#### General
```
img/lib/azure2/general/Subscriptions.svg
img/lib/azure2/general/Resource_Groups.svg
img/lib/azure2/general/Management_Groups.svg
img/lib/azure2/general/Browser.svg
img/lib/azure2/general/Mobile.svg
img/lib/azure2/general/Code.svg
img/lib/azure2/general/User.svg
img/lib/azure2/general/Templates.svg
```

#### DevOps
```
img/lib/azure2/devops/Azure_DevOps.svg
img/lib/azure2/devops/Azure_Repos.svg
img/lib/azure2/devops/Azure_Pipelines.svg
img/lib/azure2/devops/Azure_Boards.svg
img/lib/azure2/devops/Azure_Test_Plans.svg
img/lib/azure2/devops/Azure_Artifacts.svg
```

#### AI & Machine Learning
```
img/lib/azure2/ai_machine_learning/Machine_Learning.svg
img/lib/azure2/ai_machine_learning/Cognitive_Services.svg
img/lib/azure2/ai_machine_learning/Bot_Services.svg
```

#### Analytics
```
img/lib/azure2/analytics/Azure_Synapse_Analytics.svg
img/lib/azure2/analytics/Data_Factory.svg
img/lib/azure2/analytics/Databricks.svg
img/lib/azure2/analytics/Analysis_Services.svg
img/lib/azure2/analytics/Stream_Analytics_Jobs.svg
img/lib/azure2/analytics/HDInsight_Clusters.svg
```

### AWS Icons - Service Reference

```
mxgraph.aws4.ec2
mxgraph.aws4.lambda
mxgraph.aws4.ecs
mxgraph.aws4.eks
mxgraph.aws4.fargate
mxgraph.aws4.elastic_beanstalk
mxgraph.aws4.batch
mxgraph.aws4.outposts

mxgraph.aws4.vpc
mxgraph.aws4.cloudfront
mxgraph.aws4.route_53
mxgraph.aws4.api_gateway
mxgraph.aws4.elastic_load_balancing
mxgraph.aws4.direct_connect
mxgraph.aws4.transit_gateway
mxgraph.aws4.global_accelerator

mxgraph.aws4.rds
mxgraph.aws4.dynamodb
mxgraph.aws4.aurora
mxgraph.aws4.elasticache
mxgraph.aws4.redshift
mxgraph.aws4.neptune
mxgraph.aws4.documentdb
mxgraph.aws4.keyspaces
mxgraph.aws4.timestream

mxgraph.aws4.s3
mxgraph.aws4.ebs
mxgraph.aws4.efs
mxgraph.aws4.fsx
mxgraph.aws4.glacier
mxgraph.aws4.storage_gateway
mxgraph.aws4.backup

mxgraph.aws4.iam
mxgraph.aws4.cognito
mxgraph.aws4.secrets_manager
mxgraph.aws4.kms
mxgraph.aws4.waf
mxgraph.aws4.shield
mxgraph.aws4.macie
mxgraph.aws4.inspector
mxgraph.aws4.guardduty
mxgraph.aws4.security_hub

mxgraph.aws4.sqs
mxgraph.aws4.sns
mxgraph.aws4.eventbridge
mxgraph.aws4.step_functions
mxgraph.aws4.mq
mxgraph.aws4.appflow
mxgraph.aws4.app_sync

mxgraph.aws4.cloudwatch
mxgraph.aws4.cloudtrail
mxgraph.aws4.systems_manager
mxgraph.aws4.config
mxgraph.aws4.cloudformation
mxgraph.aws4.service_catalog
mxgraph.aws4.x_ray
mxgraph.aws4.codepipeline
mxgraph.aws4.codebuild
mxgraph.aws4.codecommit
mxgraph.aws4.codedeploy

mxgraph.aws4.kinesis
mxgraph.aws4.athena
mxgraph.aws4.emr
mxgraph.aws4.glue
mxgraph.aws4.quicksight
mxgraph.aws4.msk
mxgraph.aws4.opensearch
mxgraph.aws4.data_pipeline
mxgraph.aws4.lake_formation

mxgraph.aws4.sagemaker
mxgraph.aws4.comprehend
mxgraph.aws4.rekognition
mxgraph.aws4.lex
mxgraph.aws4.polly
mxgraph.aws4.transcribe
mxgraph.aws4.translate
mxgraph.aws4.personalize
mxgraph.aws4.forecast
mxgraph.aws4.textract

mxgraph.aws4.user
mxgraph.aws4.users
mxgraph.aws4.client
mxgraph.aws4.internet
mxgraph.aws4.mobile_client
```

### GCP Icons - Service Reference

```
img/lib/google/compute/Compute_Engine.svg
img/lib/google/compute/Cloud_Functions.svg
img/lib/google/compute/App_Engine.svg
img/lib/google/compute/Cloud_Run.svg
img/lib/google/compute/Kubernetes_Engine.svg

img/lib/google/networking/Cloud_Load_Balancing.svg
img/lib/google/networking/Cloud_DNS.svg
img/lib/google/networking/Cloud_CDN.svg
img/lib/google/networking/Virtual_Private_Cloud.svg
img/lib/google/networking/Cloud_Armor.svg
img/lib/google/networking/Cloud_NAT.svg

img/lib/google/database/Cloud_SQL.svg
img/lib/google/database/Cloud_Spanner.svg
img/lib/google/database/Cloud_Bigtable.svg
img/lib/google/database/Firestore.svg
img/lib/google/database/Memorystore.svg

img/lib/google/storage/Cloud_Storage.svg
img/lib/google/storage/Persistent_Disk.svg
img/lib/google/storage/Filestore.svg

img/lib/google/security/Cloud_IAM.svg
img/lib/google/security/Secret_Manager.svg
img/lib/google/security/Security_Command_Center.svg
img/lib/google/security/Cloud_Key_Management.svg

img/lib/google/management/Cloud_Monitoring.svg
img/lib/google/management/Cloud_Logging.svg
img/lib/google/management/Cloud_Trace.svg
img/lib/google/management/Cloud_Profiler.svg

img/lib/google/analytics/BigQuery.svg
img/lib/google/analytics/Dataflow.svg
img/lib/google/analytics/Dataproc.svg
img/lib/google/analytics/Pub_Sub.svg
img/lib/google/analytics/Composer.svg

img/lib/google/ai_ml/AI_Platform.svg
img/lib/google/ai_ml/AutoML.svg
img/lib/google/ai_ml/Cloud_Vision_API.svg
img/lib/google/ai_ml/Cloud_Natural_Language_API.svg
img/lib/google/ai_ml/Dialogflow.svg
```

---

## 10. XML Code Templates

### Complete Enterprise Architecture Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" version="28.1.1">
  <diagram name="Enterprise-Architecture" id="ent-arch-001">
    <mxGraphModel dx="1800" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="1200" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        
        <!-- ============================================ -->
        <!-- DIAGRAM TITLE -->
        <!-- ============================================ -->
        <mxCell id="title" value="[PROJECT NAME] - High Level Architecture"
          style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;fontSize=20;fontStyle=1;"
          vertex="1" parent="1">
          <mxGeometry x="400" y="10" width="400" height="40" as="geometry" />
        </mxCell>
        
        <!-- ============================================ -->
        <!-- USER LAYER -->
        <!-- ============================================ -->
        <mxCell id="user-zone" value="Users"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;dashed=1;verticalAlign=top;fontStyle=1;fontSize=12;"
          vertex="1" parent="1">
          <mxGeometry x="150" y="60" width="700" height="90" as="geometry" />
        </mxCell>
        
        <!-- User Icons -->
        <mxCell id="admin-user" value="Administrator"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/general/User.svg;"
          vertex="1" parent="1">
          <mxGeometry x="200" y="85" width="50" height="50" as="geometry" />
        </mxCell>
        
        <mxCell id="employee-user" value="Employee"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/general/User.svg;"
          vertex="1" parent="1">
          <mxGeometry x="400" y="85" width="50" height="50" as="geometry" />
        </mxCell>
        
        <mxCell id="browser-icon" value="Web Browser"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/general/Browser.svg;"
          vertex="1" parent="1">
          <mxGeometry x="600" y="85" width="50" height="45" as="geometry" />
        </mxCell>
        
        <!-- ============================================ -->
        <!-- EDGE/PERIMETER ZONE -->
        <!-- ============================================ -->
        <mxCell id="edge-zone" value="Edge Zone (DMZ)"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffe6cc;strokeColor=#d79b00;dashed=0;verticalAlign=top;fontStyle=1;fontSize=12;"
          vertex="1" parent="1">
          <mxGeometry x="150" y="170" width="700" height="100" as="geometry" />
        </mxCell>
        
        <!-- Load Balancer -->
        <mxCell id="load-balancer" value="Load Balancer"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/networking/Load_Balancers.svg;"
          vertex="1" parent="1">
          <mxGeometry x="400" y="195" width="65" height="52" as="geometry" />
        </mxCell>
        
        <!-- CDN -->
        <mxCell id="cdn" value="CDN"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/networking/CDN_Profiles.svg;"
          vertex="1" parent="1">
          <mxGeometry x="550" y="195" width="65" height="52" as="geometry" />
        </mxCell>
        
        <!-- WAF -->
        <mxCell id="waf" value="WAF"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/networking/Firewall.svg;"
          vertex="1" parent="1">
          <mxGeometry x="250" y="195" width="65" height="52" as="geometry" />
        </mxCell>
        
        <!-- ============================================ -->
        <!-- APPLICATION ZONE -->
        <!-- ============================================ -->
        <mxCell id="app-zone" value="Application Zone"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;dashed=0;verticalAlign=top;fontStyle=1;fontSize=12;"
          vertex="1" parent="1">
          <mxGeometry x="150" y="290" width="700" height="180" as="geometry" />
        </mxCell>
        
        <!-- Availability Zone A -->
        <mxCell id="az-a" value="Zone A"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;dashed=1;verticalAlign=top;fontSize=10;"
          vertex="1" parent="1">
          <mxGeometry x="170" y="315" width="200" height="140" as="geometry" />
        </mxCell>
        
        <!-- Availability Zone B -->
        <mxCell id="az-b" value="Zone B"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;dashed=1;verticalAlign=top;fontSize=10;"
          vertex="1" parent="1">
          <mxGeometry x="400" y="315" width="200" height="140" as="geometry" />
        </mxCell>
        
        <!-- Availability Zone C -->
        <mxCell id="az-c" value="Zone C"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;dashed=1;verticalAlign=top;fontSize=10;"
          vertex="1" parent="1">
          <mxGeometry x="630" y="315" width="200" height="140" as="geometry" />
        </mxCell>
        
        <!-- Frontend App -->
        <mxCell id="frontend-a" value="Frontend"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/app_services/App_Services.svg;"
          vertex="1" parent="1">
          <mxGeometry x="210" y="340" width="50" height="50" as="geometry" />
        </mxCell>
        
        <!-- Backend API -->
        <mxCell id="backend-a" value="Backend API"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/compute/Function_Apps.svg;"
          vertex="1" parent="1">
          <mxGeometry x="280" y="340" width="50" height="50" as="geometry" />
        </mxCell>
        
        <!-- Frontend App Zone B -->
        <mxCell id="frontend-b" value="Frontend"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/app_services/App_Services.svg;"
          vertex="1" parent="1">
          <mxGeometry x="440" y="340" width="50" height="50" as="geometry" />
        </mxCell>
        
        <!-- Backend API Zone B -->
        <mxCell id="backend-b" value="Backend API"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/compute/Function_Apps.svg;"
          vertex="1" parent="1">
          <mxGeometry x="510" y="340" width="50" height="50" as="geometry" />
        </mxCell>
        
        <!-- Container Registry -->
        <mxCell id="acr" value="Container Registry"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/containers/Container_Registries.svg;"
          vertex="1" parent="1">
          <mxGeometry x="670" y="340" width="50" height="50" as="geometry" />
        </mxCell>
        
        <!-- AKS -->
        <mxCell id="aks" value="AKS"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/containers/Kubernetes_Services.svg;"
          vertex="1" parent="1">
          <mxGeometry x="740" y="340" width="50" height="50" as="geometry" />
        </mxCell>
        
        <!-- ============================================ -->
        <!-- DATA ZONE -->
        <!-- ============================================ -->
        <mxCell id="data-zone" value="Data Zone"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;dashed=0;verticalAlign=top;fontStyle=1;fontSize=12;"
          vertex="1" parent="1">
          <mxGeometry x="150" y="490" width="700" height="120" as="geometry" />
        </mxCell>
        
        <!-- Primary Database -->
        <mxCell id="primary-db" value="SQL Database&#xa;(Primary)"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/databases/SQL_Database.svg;"
          vertex="1" parent="1">
          <mxGeometry x="230" y="520" width="55" height="55" as="geometry" />
        </mxCell>
        
        <!-- Secondary Database -->
        <mxCell id="secondary-db" value="SQL Database&#xa;(Secondary)"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/databases/SQL_Database.svg;"
          vertex="1" parent="1">
          <mxGeometry x="350" y="520" width="55" height="55" as="geometry" />
        </mxCell>
        
        <!-- Redis Cache -->
        <mxCell id="redis" value="Redis Cache"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/databases/Cache_Redis.svg;"
          vertex="1" parent="1">
          <mxGeometry x="470" y="520" width="55" height="55" as="geometry" />
        </mxCell>
        
        <!-- Blob Storage -->
        <mxCell id="blob-storage" value="Blob Storage"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/storage/Blob_Storage.svg;"
          vertex="1" parent="1">
          <mxGeometry x="590" y="520" width="55" height="55" as="geometry" />
        </mxCell>
        
        <!-- Key Vault -->
        <mxCell id="key-vault" value="Key Vault"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=10;image=img/lib/azure2/security/Key_Vaults.svg;"
          vertex="1" parent="1">
          <mxGeometry x="710" y="520" width="55" height="55" as="geometry" />
        </mxCell>
        
        <!-- ============================================ -->
        <!-- INTEGRATION ZONE (External Systems) -->
        <!-- ============================================ -->
        <mxCell id="integration-zone" value="Integration Zone (External Systems)"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;dashed=0;verticalAlign=top;fontStyle=1;fontSize=12;"
          vertex="1" parent="1">
          <mxGeometry x="150" y="630" width="700" height="100" as="geometry" />
        </mxCell>
        
        <!-- External System 1 -->
        <mxCell id="ext-system-1" value="Accounting&#xa;(JD Edwards)"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#74B9FF;strokeColor=#5599DD;fontSize=10;"
          vertex="1" parent="1">
          <mxGeometry x="200" y="660" width="100" height="50" as="geometry" />
        </mxCell>
        
        <!-- External System 2 -->
        <mxCell id="ext-system-2" value="HRIS&#xa;(SmartData)"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#74B9FF;strokeColor=#5599DD;fontSize=10;"
          vertex="1" parent="1">
          <mxGeometry x="350" y="660" width="100" height="50" as="geometry" />
        </mxCell>
        
        <!-- External System 3 -->
        <mxCell id="ext-system-3" value="Email Service&#xa;(3rd Party)"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#00B894;strokeColor=#009977;fontSize=10;"
          vertex="1" parent="1">
          <mxGeometry x="500" y="660" width="100" height="50" as="geometry" />
        </mxCell>
        
        <!-- External System 4 -->
        <mxCell id="ext-system-4" value="Fund Manager&#xa;API"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#00B894;strokeColor=#009977;fontSize=10;"
          vertex="1" parent="1">
          <mxGeometry x="650" y="660" width="100" height="50" as="geometry" />
        </mxCell>
        
        <!-- ============================================ -->
        <!-- MANAGEMENT ZONE (Sidebar) -->
        <!-- ============================================ -->
        <mxCell id="mgmt-zone" value="Management &amp; Monitoring"
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;dashed=1;verticalAlign=top;fontStyle=1;fontSize=12;"
          vertex="1" parent="1">
          <mxGeometry x="870" y="170" width="120" height="440" as="geometry" />
        </mxCell>
        
        <!-- Azure AD -->
        <mxCell id="azure-ad" value="Azure AD"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=9;image=img/lib/azure2/identity/Azure_Active_Directory.svg;"
          vertex="1" parent="1">
          <mxGeometry x="895" y="200" width="50" height="50" as="geometry" />
        </mxCell>
        
        <!-- Monitor -->
        <mxCell id="monitor" value="Monitor"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=9;image=img/lib/azure2/management_governance/Monitor.svg;"
          vertex="1" parent="1">
          <mxGeometry x="895" y="270" width="50" height="50" as="geometry" />
        </mxCell>
        
        <!-- App Insights -->
        <mxCell id="app-insights" value="App Insights"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=9;image=img/lib/azure2/management_governance/Application_Insights.svg;"
          vertex="1" parent="1">
          <mxGeometry x="895" y="340" width="50" height="50" as="geometry" />
        </mxCell>
        
        <!-- Log Analytics -->
        <mxCell id="log-analytics" value="Log Analytics"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=9;image=img/lib/azure2/management_governance/Log_Analytics_Workspaces.svg;"
          vertex="1" parent="1">
          <mxGeometry x="895" y="410" width="50" height="50" as="geometry" />
        </mxCell>
        
        <!-- DevOps -->
        <mxCell id="devops" value="DevOps"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=9;image=img/lib/azure2/devops/Azure_DevOps.svg;"
          vertex="1" parent="1">
          <mxGeometry x="895" y="480" width="50" height="50" as="geometry" />
        </mxCell>
        
        <!-- Backup -->
        <mxCell id="backup" value="Backup"
          style="image;aspect=fixed;html=1;points=[];align=center;fontSize=9;image=img/lib/azure2/storage/Recovery_Services_Vaults.svg;"
          vertex="1" parent="1">
          <mxGeometry x="895" y="550" width="50" height="50" as="geometry" />
        </mxCell>
        
        <!-- ============================================ -->
        <!-- CONNECTIONS -->
        <!-- ============================================ -->
        
        <!-- User to Load Balancer -->
        <mxCell id="conn-user-lb" value="HTTPS"
          style="endArrow=blockThin;endFill=1;html=1;rounded=0;strokeWidth=2;strokeColor=#0066CC;edgeStyle=orthogonalEdgeStyle;"
          edge="1" parent="1" source="browser-icon" target="load-balancer">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        
        <!-- Load Balancer to Frontend -->
        <mxCell id="conn-lb-frontend" value=""
          style="endArrow=blockThin;endFill=1;html=1;rounded=0;strokeWidth=2;strokeColor=#0066CC;edgeStyle=orthogonalEdgeStyle;"
          edge="1" parent="1" source="load-balancer" target="frontend-a">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        
        <!-- Frontend to Backend -->
        <mxCell id="conn-fe-be" value="REST API"
          style="endArrow=blockThin;endFill=1;html=1;rounded=0;strokeWidth=2;strokeColor=#00AA00;edgeStyle=orthogonalEdgeStyle;"
          edge="1" parent="1" source="frontend-a" target="backend-a">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        
        <!-- Backend to Database -->
        <mxCell id="conn-be-db" value="TLS"
          style="endArrow=blockThin;endFill=1;html=1;rounded=0;strokeWidth=2;strokeColor=#9933FF;edgeStyle=orthogonalEdgeStyle;"
          edge="1" parent="1" source="backend-a" target="primary-db">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        
        <!-- Backend to Cache -->
        <mxCell id="conn-be-cache" value=""
          style="endArrow=blockThin;endFill=1;html=1;dashed=1;strokeWidth=1;strokeColor=#FF6600;edgeStyle=orthogonalEdgeStyle;"
          edge="1" parent="1" source="backend-a" target="redis">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        
        <!-- Database Replication -->
        <mxCell id="conn-db-repl" value="Replication"
          style="endArrow=blockThin;startArrow=blockThin;endFill=1;startFill=1;html=1;dashed=1;dashPattern=5 5;strokeWidth=1;strokeColor=#9933FF;edgeStyle=orthogonalEdgeStyle;"
          edge="1" parent="1" source="primary-db" target="secondary-db">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        
        <!-- Backend to External Systems -->
        <mxCell id="conn-be-ext1" value="API"
          style="endArrow=blockThin;endFill=1;html=1;rounded=0;strokeWidth=1;strokeColor=#666666;edgeStyle=orthogonalEdgeStyle;"
          edge="1" parent="1" source="backend-b" target="ext-system-1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        
        <mxCell id="conn-be-ext2" value="Sync"
          style="endArrow=blockThin;endFill=1;html=1;rounded=0;strokeWidth=1;strokeColor=#666666;edgeStyle=orthogonalEdgeStyle;"
          edge="1" parent="1" source="backend-b" target="ext-system-2">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        
        <!-- ============================================ -->
        <!-- LEGEND -->
        <!-- ============================================ -->
        <mxCell id="legend-container" value="Legend"
          style="swimlane;startSize=23;fillColor=#FFFFFF;strokeColor=#000000;fontStyle=1;fontSize=11;"
          vertex="1" parent="1">
          <mxGeometry x="1020" y="60" width="180" height="200" as="geometry" />
        </mxCell>
        
        <mxCell id="legend-scope" value=""
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FF6B35;strokeColor=#CC5500;"
          vertex="1" parent="legend-container">
          <mxGeometry x="10" y="35" width="25" height="18" as="geometry" />
        </mxCell>
        <mxCell id="legend-scope-label" value="In Scope (New)"
          style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=10;"
          vertex="1" parent="legend-container">
          <mxGeometry x="45" y="35" width="120" height="18" as="geometry" />
        </mxCell>
        
        <mxCell id="legend-existing" value=""
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#74B9FF;strokeColor=#5599DD;"
          vertex="1" parent="legend-container">
          <mxGeometry x="10" y="60" width="25" height="18" as="geometry" />
        </mxCell>
        <mxCell id="legend-existing-label" value="Existing Systems"
          style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=10;"
          vertex="1" parent="legend-container">
          <mxGeometry x="45" y="60" width="120" height="18" as="geometry" />
        </mxCell>
        
        <mxCell id="legend-external" value=""
          style="rounded=1;whiteSpace=wrap;html=1;fillColor=#00B894;strokeColor=#009977;"
          vertex="1" parent="legend-container">
          <mxGeometry x="10" y="85" width="25" height="18" as="geometry" />
        </mxCell>
        <mxCell id="legend-external-label" value="3rd Party Services"
          style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=10;"
          vertex="1" parent="legend-container">
          <mxGeometry x="45" y="85" width="120" height="18" as="geometry" />
        </mxCell>
        
        <mxCell id="legend-flow1" value=""
          style="endArrow=blockThin;endFill=1;html=1;strokeWidth=2;strokeColor=#0066CC;"
          edge="1" parent="legend-container">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="10" y="120" as="sourcePoint" />
            <mxPoint x="35" y="120" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="legend-flow1-label" value="User Traffic (HTTPS)"
          style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=10;"
          vertex="1" parent="legend-container">
          <mxGeometry x="45" y="112" width="120" height="18" as="geometry" />
        </mxCell>
        
        <mxCell id="legend-flow2" value=""
          style="endArrow=blockThin;endFill=1;html=1;strokeWidth=2;strokeColor=#00AA00;"
          edge="1" parent="legend-container">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="10" y="145" as="sourcePoint" />
            <mxPoint x="35" y="145" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="legend-flow2-label" value="API Calls (REST)"
          style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=10;"
          vertex="1" parent="legend-container">
          <mxGeometry x="45" y="137" width="120" height="18" as="geometry" />
        </mxCell>
        
        <mxCell id="legend-flow3" value=""
          style="endArrow=blockThin;endFill=1;html=1;strokeWidth=2;strokeColor=#9933FF;"
          edge="1" parent="legend-container">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="10" y="170" as="sourcePoint" />
            <mxPoint x="35" y="170" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="legend-flow3-label" value="Database (TLS)"
          style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=10;"
          vertex="1" parent="legend-container">
          <mxGeometry x="45" y="162" width="120" height="18" as="geometry" />
        </mxCell>
        
        <!-- ============================================ -->
        <!-- NOTES PANEL -->
        <!-- ============================================ -->
        <mxCell id="notes-panel" value="Architecture Notes"
          style="swimlane;startSize=23;fillColor=#FFF2CC;strokeColor=#D6B656;fontStyle=1;fontSize=11;"
          vertex="1" parent="1">
          <mxGeometry x="1020" y="280" width="180" height="220" as="geometry" />
        </mxCell>
        
        <mxCell id="notes-content" value="&lt;b&gt;Performance:&lt;/b&gt;&lt;br&gt;• CCU: ~500 users&lt;br&gt;• Response: &lt;2s&lt;br&gt;&lt;br&gt;&lt;b&gt;Security:&lt;/b&gt;&lt;br&gt;• TLS 1.3&lt;br&gt;• Zero Trust Model&lt;br&gt;• Data Encryption&lt;br&gt;&lt;br&gt;&lt;b&gt;Availability:&lt;/b&gt;&lt;br&gt;• Multi-AZ Deploy&lt;br&gt;• 99.9% SLA&lt;br&gt;&lt;br&gt;&lt;b&gt;DR:&lt;/b&gt;&lt;br&gt;• RPO: 15 min&lt;br&gt;• RTO: 1 hour"
          style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=top;fontSize=9;spacingLeft=5;spacingTop=5;"
          vertex="1" parent="notes-panel">
          <mxGeometry x="5" y="28" width="170" height="185" as="geometry" />
        </mxCell>
        
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## 11. Best Practices Checklist

### Pre-Diagram Planning
- [ ] Identify target audience (executive, technical, operations)
- [ ] Define scope boundaries (in-scope vs out-of-scope)
- [ ] List all major components and their relationships
- [ ] Determine cloud platform(s) and icon libraries needed
- [ ] Plan zone-based layout structure

### Diagram Structure
- [ ] Include descriptive title with project name
- [ ] Use logical zone groupings (User, Edge, App, Data, Integration)
- [ ] Separate NT scope from client/existing systems
- [ ] Include availability zone indicators for HA designs
- [ ] Add management/monitoring zone (sidebar or separate)

### Visual Standards
- [ ] Consistent color coding for scope types
- [ ] Proper icon sizing (typically 50-65px width)
- [ ] Aligned components within zones
- [ ] Clear spacing between elements (80-120px)
- [ ] Readable font sizes (10-14px for labels)

### Connections
- [ ] All flows have directional arrows
- [ ] Different line styles for different flow types
- [ ] Protocol/connection type labels where relevant
- [ ] Logical routing (avoid crossing lines where possible)
- [ ] Security boundaries clearly marked

### Documentation
- [ ] Legend explaining all colors and symbols
- [ ] Architecture notes panel with key specifications
- [ ] Technology labels on components
- [ ] Version/date indicator (in notes or title)

### Quality Assurance
- [ ] XML validates without errors
- [ ] Icons render correctly in Draw.io
- [ ] All component IDs are unique
- [ ] Parent-child relationships correct
- [ ] Connections reference valid source/target IDs

---

## Quick Reference: Common Icon Patterns

### Azure Web Application Stack
```xml
<!-- Frontend -->
<mxCell style="image;...;image=img/lib/azure2/app_services/App_Services.svg;" />

<!-- API Gateway -->
<mxCell style="image;...;image=img/lib/azure2/integration/API_Management.svg;" />

<!-- Backend Functions -->
<mxCell style="image;...;image=img/lib/azure2/compute/Function_Apps.svg;" />

<!-- SQL Database -->
<mxCell style="image;...;image=img/lib/azure2/databases/SQL_Database.svg;" />

<!-- Cache -->
<mxCell style="image;...;image=img/lib/azure2/databases/Cache_Redis.svg;" />

<!-- Storage -->
<mxCell style="image;...;image=img/lib/azure2/storage/Blob_Storage.svg;" />

<!-- Key Vault -->
<mxCell style="image;...;image=img/lib/azure2/security/Key_Vaults.svg;" />
```

### AWS Serverless Stack
```xml
<!-- API Gateway -->
<mxCell style="...;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.api_gateway;" />

<!-- Lambda -->
<mxCell style="...;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.lambda;" />

<!-- DynamoDB -->
<mxCell style="...;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.dynamodb;" />

<!-- S3 -->
<mxCell style="...;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.s3;" />

<!-- Cognito -->
<mxCell style="...;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.cognito;" />
```

### GCP Container Stack
```xml
<!-- GKE -->
<mxCell style="image;...;image=img/lib/google/compute/Kubernetes_Engine.svg;" />

<!-- Cloud SQL -->
<mxCell style="image;...;image=img/lib/google/database/Cloud_SQL.svg;" />

<!-- Cloud Storage -->
<mxCell style="image;...;image=img/lib/google/storage/Cloud_Storage.svg;" />

<!-- Pub/Sub -->
<mxCell style="image;...;image=img/lib/google/analytics/Pub_Sub.svg;" />
```

---

## Usage Notes

1. **File Extension**: Save files with `.drawio` or `.xml` extension
2. **Opening**: Files can be opened in draw.io desktop app, web app (app.diagrams.net), or VS Code extension
3. **Icon Libraries**: Enable cloud icon libraries via More Shapes > Networking section
4. **ID Generation**: Use unique, descriptive IDs for each element (e.g., `azure-sql-primary`)
5. **Parent Relationships**: Set `parent="1"` for top-level elements, or parent ID for nested elements

---

*Document Version: 1.0*
*Last Updated: November 2025*
*Compatible with: Draw.io v28.x+*
