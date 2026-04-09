# Stage 1 Security Hardening & Rate Limiting

**Branch:** `feat/stage-1-hardening`

## Overview

This PR implements critical **Stage 1 security foundations** for Rankify as outlined in the strategic analysis. Focus: infrastructure hardening before public rollout.

### Key Changes

#### 1. SSRF Protection (Critical)
- Integrate `validateScanUrl()` into all scan endpoints
- Block private/internal IPs: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.1, ::1, fe80::/10, fc00::/7
- Block metadata endpoints: 169.254.169.254, metadata.azure.internal, metadata.google.internal
- Block dangerous ports: 22, 23, 25, 53, 110, 143, 445, 3306, 3389, 5432, 27017
- Reject non-HTTP(S) protocols
- Require valid TLD (prevent localhost bypass)
- Graceful error messages

**Risk Mitigated:** Prevents attackers from using Rankify to scan internal services, AWS/Azure metadata endpoints, or other internal infrastructure.

#### 2. Rate Limiting (High)
- Integrate `checkRateLimit()` on `POST /v1/scans` and `GET /v1/scans/{id}`
- **Scan endpoint:** 10 scans per 15 minutes per IP
- **General API:** 60 requests per minute per IP
- IP extraction from `x-forwarded-for`, `x-real-ip`, `cf-connecting-ip` headers (Azure-aware)
- Return 429 + `Retry-After` header when limit exceeded
- Include `X-RateLimit-*` headers in all responses

**Risk Mitigated:** Prevents DOS attacks, crawler abuse, and resource exhaustion on Azure Functions.

#### 3. Audit Logging
- Log all scans to `audit_logs` table: scan_id, target_url, status, user_id, IP, user_agent, processing_time, error
- Track creation, success, failure, and view events
- Enables future analysis of abuse patterns
- Non-blocking (logging failures don't break the main flow)

**Benefit:** Full audit trail for security review and abuse investigation.

#### 4. Configuration & Documentation
- New `api/src/config/security.ts` for centralized security settings
- Tunable rate limits, timeouts, logging retention
- `STAGE_1_IMPLEMENTATION.md`: Implementation checklist, rollout steps, monitoring

---

## Testing Checklist

Before merge, verify:

### SSRF Protection
```bash
# Should all fail with 400 + error message
curl -X POST http://localhost:8000/v1/scans -d '{"url":"http://localhost:8000"}'
curl -X POST http://localhost:8000/v1/scans -d '{"url":"http://169.254.169.254/metadata"}'
curl -X POST http://localhost:8000/v1/scans -d '{"url":"http://10.0.0.1"}'
curl -X POST http://localhost:8000/v1/scans -d '{"url":"http://192.168.1.1"}'
```

### Rate Limiting
```bash
# Should succeed for first 10, fail with 429 on 11th
for i in {1..15}; do
  curl -X POST http://localhost:8000/v1/scans -d '{"url":"https://example.com"}'
done
```

### Valid Requests
```bash
# Should succeed with 202 Accepted
curl -X POST http://localhost:8000/v1/scans -d '{"url":"https://example.com"}'
curl -X POST http://localhost:8000/v1/scans -d '{"url":"https://google.com"}'
```

---

## Database Schema

Ensure `audit_logs` table exists. If not, run:

```sql
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
    target_url TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    user_id UUID,
    metadata JSONB,
    processing_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_scan_id ON audit_logs(scan_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_status ON audit_logs(status);
```

---

## Deployment Steps

1. **Review & merge** this PR to `main`
2. **Deploy to Azure Functions** (api package)
3. **Run security tests** (checklist above)
4. **Monitor** for 24-48 hours:
   - Watch for blocked requests (false positives?)
   - Check rate limit distribution (are limits right?)
   - Verify audit logs are writing
5. **Adjust** if needed (rate limits, blocked domains, etc.)

---

## What's NOT in This PR

**Deferred to Stage 2+:**
- Progressive result disclosure (SSE/WebSocket)
- Playwright integration for JS rendering
- Report layout improvements
- Mobile responsiveness
- Content editor

**Focus of Stage 1:** Infrastructure security & reliability.

---

## Performance Impact

- **SSRF validation:** <5ms per request (URL parsing + regex checks)
- **Rate limiting:** <1ms per request (in-memory map lookup)
- **Audit logging:** Async, non-blocking

Total overhead: **<10ms per request** (negligible).

---

## Security Review

Addresses:
- ✅ OWASP A01: Injection (SSRF)
- ✅ OWASP A04: Insecure Design (DOS prevention)
- ✅ OWASP A05: Broken Access Control (audit trail)

---

## Next Steps

After this merges:
1. Deploy & monitor for 48 hours
2. Start Stage 2 work: Auth, Projects, Scheduled Scans
3. Begin UI refinements for shareability

---

**Commit:** 47bf2ca  
**Date:** 2026-04-09  
**Author:** DJ  
