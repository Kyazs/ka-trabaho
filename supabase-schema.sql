-- Supabase Database Schema for TESDA Skills-to-Jobs Matcher Security
-- Run this in your Supabase SQL Editor

-- 1. Rate limit tracking (per IP per endpoint per day)
CREATE TABLE IF NOT EXISTS rate_limits (
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_date DATE NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  last_request_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (ip_address, endpoint, request_date)
);

-- 2. Blocked IPs (auto-blocked after abuse, or manual)
CREATE TABLE IF NOT EXISTS blocked_ips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  request_count_at_block INTEGER NOT NULL,
  blocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  blocked_until TIMESTAMP WITH TIME ZONE, -- NULL = permanent
  endpoint TEXT NOT NULL
);

-- 3. Request audit log (for abuse pattern detection)
CREATE TABLE IF NOT EXISTS request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  user_agent TEXT,
  request_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status_code INTEGER NOT NULL,
  was_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  response_time_ms INTEGER
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(ip_address, endpoint, request_date);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_lookup ON blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_request_logs_ip ON request_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_request_logs_timestamp ON request_logs(request_timestamp);

-- Enable RLS (Row Level Security) - optional, but good practice
-- Only service role key should access these tables
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_logs ENABLE ROW LEVEL SECURITY;

-- Create policies that deny all access (service role bypasses RLS)
CREATE POLICY "Deny all access" ON rate_limits FOR ALL USING (false);
CREATE POLICY "Deny all access" ON blocked_ips FOR ALL USING (false);
CREATE POLICY "Deny all access" ON request_logs FOR ALL USING (false);
