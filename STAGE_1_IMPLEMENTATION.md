# Stage 1 Implementation Checklist

## Commit: feat/stage-1-hardening

### Security Hardening ✅

#### SSRF Protection ✅
- [x] URL validation integrated into `createScan` endpoint
- [x] Private IP ranges blocked (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.1, ::1)
- [x] Metadata endpoints blocked (169.254.169.254, Azure metadata)
- [x] Dangerous ports blocked (22, 23, 3306, 5432, 27017, etc.)
- [x] Protocol validation (HTTP/HTTPS only)
- [x] Graceful error messages for blocked requests
- **Test**: Try auditing `http://localhost:8000`, `http://169.254.169.254/metadata`, `http://10.0.0.1` — all should fail with 400 + error message

#### Rate Limiting ✅
- [x] Rate limiting middleware integrated on `createScan` and `getScan`
- [x] IP-based tracking (extract from x-forwarded-for header)
- [x] Config: 10 scans per 15 minutes per IP (scan endpoint)
- [x] Config: 60 requests per minute per IP (general API)
- [x] Rate limit headers returned in response (X-RateLimit-*, Retry-After)
- [x] Graceful 429 response when limit exceeded
- **Test**: Submit 15+ rapid requests from same IP — should get 429 on 11th

#### Input Validation ✅
- [x] URL format validation (strict URL parsing)
- [x] URL length check (max 2048 chars)
- [x] Protocol check (only http/https)
- [x] TLD requirement (prevent single-label domains)
- [x] Port whitelist validation
- [x] UUID format validation for scan IDs
- [x] IP extraction hardened (handles x-forwarded-for correctly)

#### Audit Logging ✅
- [x] All scans logged to `audit_logs` table
- [x] Failed scans logged separately
- [x] Client IP captured (for security review)
- [x] User-Agent captured
- [x] Processing time tracked

### Configuration & Documentation ✅
- [x] Security config file created (`api/src/config/security.ts`)
- [x] Rate limit configs documented
- [x] SSRF protection documented
- [x] Risk matrix in analysis/

### Database Considerations
- Ensure `audit_logs` table exists:
```sql
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID REFERENCES scans(id),
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
```

## What's NOT in this PR (defer to later)

- Progressive result disclosure (SSE/WebSocket) — requires frontend changes
- Playwright integration — worker setup required
- Report layout improvements — frontend changes
- Mobile responsiveness — frontend changes
- Error page improvements — frontend changes

These are Stage 2+ work. Stage 1 focus: infrastructure security.

## Rollout Steps

1. **Merge this PR** to `main`
2. **Deploy to Azure** (Functions + Container Apps)
3. **Test security**:
   - SSRF: Try auditing internal IPs
   - Rate limiting: Rapid requests
   - Error handling: Invalid URLs
4. **Monitor logs**: Watch for blocked requests (false positives?)
5. **Adjust config** if needed (rate limit thresholds, etc.)

## Monitoring

After deployment, watch for:
- `Rate limit exceeded` logs — are limits too strict?
- `Cannot scan private/internal addresses` logs — false positives?
- HTTP 429 responses — expected?
- Average response time — should be <1s for rate limit checks

## Next Steps (Stage 2)

Once this ships:
1. Playwright integration in worker
2. Auth + Projects model
3. Scheduled scans
4. Email alerts
5. Progressive result disclosure
