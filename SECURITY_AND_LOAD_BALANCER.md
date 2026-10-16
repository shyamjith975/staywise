# Staywise Platform — Security, Validation & High-Availability Load Balancer Architecture

This document provides a comprehensive operational overview of the security hardening, input validation, rate limiting, and Layer 7 load balancer architecture implemented for the **Staywise** enterprise real estate operating system.

---

## 1. Enterprise Validation & Input Sanitization Layer

### Location: [`src/lib/validation/index.ts`](file:///c:/Users/Lenovo/Documents/Staywise/src/lib/validation/index.ts)

Every API request payload passing into the platform undergoes schema validation and sanitization prior to business logic execution.

### Key Defenses Implemented:
1. **XSS Defense (Cross-Site Scripting)**:
   - Strips `<script>`, `<iframe>`, and HTML tag payloads from string inputs.
   - Cleans `javascript:` URIs and DOM event handlers (`onclick`, `onerror`).
2. **Field-Level Schema Validation**:
   - `validateSignupPayload`: Enforces RFC email format, password strength (minimum 6 characters), valid phone formats (+91 / international), and strictly whitelisted registration roles (`owner` and `estate_manager`).
   - `validateLoginPayload`: Sanitizes email, validates non-empty passwords and allowed roles.
   - `validatePropertyPayload`: Validates name, address, operational city, and checks that financial fields (`expectedMonthlyRent`) and room units are positive finite numbers.
   - `validatePaymentPayload`: Validates payment rail (`UPI`, `Bank Transfer`, `Card`, `Autopay`, `FlexPay`) and positive transfer amounts.
   - `validateReferralPayload` & `validateInfluencerOfferPayload`: Validates promo codes, campaign handles, and commission values.
3. **Structured Error Responses**:
   - On invalid input, returns HTTP `400 Bad Request` with an itemized array:
   ```json
   {
     "success": false,
     "error": "Full name is required and must be at least 2 characters.",
     "validationErrors": [
       { "field": "name", "message": "Full name is required and must be at least 2 characters." },
       { "field": "email", "message": "Please provide a valid email address (e.g. name@domain.com)." }
     ]
   }
   ```

---

## 2. Institutional Web Security & Rate Limiting

### Locations:
- [`src/proxy.ts`](file:///c:/Users/Lenovo/Documents/Staywise/src/proxy.ts) (Next.js 16 Gateway Proxy)
- [`next.config.ts`](file:///c:/Users/Lenovo/Documents/Staywise/next.config.ts) (Framework-level Security Headers)

### Applied Security Headers (OWASP Top 10 Standards):
| Header | Value | Purpose |
|---|---|---|
| `X-Frame-Options` | `SAMEORIGIN` | Disallows external iframe embedding to eliminate clickjacking attacks. |
| `X-Content-Type-Options` | `nosniff` | Blocks MIME-type sniffing of uploaded documents and PDFs. |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces 2-year HTTPS enforcement across all subdomains. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Protects sensitive URL query parameters during navigation. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Restricts browser hardware access to unauthorized scripts. |
| `X-DNS-Prefetch-Control` | `on` | Optimizes external asset lookup performance while preserving privacy. |
| `X-Cluster-Node-Id` | `staywise-worker-node-3005` | Diagnostic header indicating the serving worker node. |
| `X-Served-By` | `staywise-load-balancer` | Traces reverse proxy routing. |

### Layer 7 In-Memory Rate Limiting:
- **Authentication Routes (`/api/auth/*`)**:
  - Maximum **15 requests per minute** per client IP.
  - Mitigates brute-force attacks and credential stuffing.
- **General API Routes (`/api/*`)**:
  - Maximum **120 requests per minute** per client IP.
  - Prevents DDoS, query exhaustion, and automated scrapers.
- **Breach Response**:
  - Emits HTTP `429 Too Many Requests` with `Retry-After: 60` and `X-RateLimit-*` headers.

---

## 3. High-Availability Load Balancer Architecture

### Upstream Topology

```
                       [ Incoming Public Traffic ]
                                   │
                                   ▼
             [ NGINX L7 Reverse Proxy & Load Balancer ]
             - Port 80 (HTTP -> 301 Redirect to HTTPS)
             - Port 443 (SSL/TLS 1.3 Termination)
             - Algorithm: Least Connections (least_conn)
             - Sticky Session Support for Escrow Transactions
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
 [ Staywise Node 1 ]        [ Staywise Node 2 ]        [ Staywise Node 3 ]
  Port 3005 (Primary)        Port 3006 (Replica)        Port 3007 (Replica)
        │                          │                          │
        └──────────────────────────┼──────────────────────────┘
                                   │
                                   ▼
                [ Atomic Database Engine & Escrow Ledger ]
                 - data/staywise_db.json (ACID Safe)
                 - Active Health Check Probe (/api/health)
```

---

## 4. Configuration Artifacts

### 1. NGINX Configuration: [`nginx/staywise-lb.conf`](file:///c:/Users/Lenovo/Documents/Staywise/nginx/staywise-lb.conf)
- Configures upstream pool `staywise_cluster` across 3 worker ports.
- Employs `least_conn` routing algorithm.
- Directs static assets (`/_next/static/`, `/images/`) through high-performance caching (365 days / 30 days).
- Implements `limit_req` zones for DDoS defense.

### 2. Multi-Node Docker Architecture: [`docker-compose.yml`](file:///c:/Users/Lenovo/Documents/Staywise/docker-compose.yml)
- Deploys:
  - `staywise-lb`: NGINX Alpine container exposing 80 and 443.
  - `staywise-app-1`, `staywise-app-2`, `staywise-app-3`: Next.js worker replicas with automated health checks probing `/api/health`.
  - Shared volume: `staywise-db-data`.

### 3. Production Multi-Stage Dockerfile: [`Dockerfile`](file:///c:/Users/Lenovo/Documents/Staywise/Dockerfile)
- 3-stage lightweight Alpine build (`deps` -> `builder` -> `runner`).
- Runs as an unprivileged system user (`nextjs:nodejs`).

### 4. PM2 Process Manager Cluster: [`ecosystem.config.js`](file:///c:/Users/Lenovo/Documents/Staywise/ecosystem.config.js)
- Native Linux/Windows cluster deployment.
- Spawns multi-worker cluster using all CPU cores (`instances: "max"`).
- Automatic zero-downtime reloads and memory ceiling management (`max_memory_restart: '1G'`).

---

## 5. Health Check & Diagnostics API

### Endpoint: `GET /api/health`
Used by Cloudflare, NGINX, and load balancers to assess cluster status.

**Sample Response (`HTTP 200 OK`):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "staywise-enterprise-core",
  "environment": "production",
  "clusterNode": "staywise-worker-node-3005",
  "uptimeSeconds": 1420,
  "timestamp": "2026-10-04T02:01:33.000Z",
  "latencyMs": 2,
  "loadBalancer": {
    "algorithm": "least_conn",
    "clusterPool": "staywise_cluster",
    "healthyReplicas": 3,
    "healthCheckInterval": "5s"
  },
  "services": {
    "database": {
      "status": "operational",
      "driver": "AtomicJsonEngine (ACID Safe)",
      "recordsMonitored": 3
    },
    "rateLimiter": {
      "status": "active",
      "windowSec": 60,
      "policy": "sliding_window_token_bucket"
    },
    "securityHeaders": {
      "csp": "enforced",
      "hsts": "enforced",
      "xFrameOptions": "SAMEORIGIN",
      "xContentTypeOptions": "nosniff"
    }
  },
  "systemMetrics": {
    "heapUsedMB": 30.5,
    "heapTotalMB": 41.5,
    "rssMB": 26.2
  }
}
```

---

## 6. Super Admin Live Cluster Diagnostics

In the Super Admin portal (`/admin`), navigate to the **Statutory Ledger & System Flags** tab:
- **Load Balancer, Cluster Health & WAF Security Card**:
  - Live Upstream Pool display (`staywise-node-1 :3005`, `staywise-node-2 :3006`, `staywise-node-3 :3007`).
  - Active rate limits and security shield policies.
  - Interactive **"Probe Live Health (/api/health)"** button providing real-time telemetry inspection with JSON readouts.
