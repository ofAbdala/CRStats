#!/bin/bash

# Script to apply schema to Supabase
# This script uses the Supabase SQL Editor API to execute the schema

SUPABASE_URL="https://tjfzplxjsffddlvwtdtq.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqZnpwbHhqc2ZmZGRsdnd0ZHRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzczNzI4MCwiZXhwIjoyMDc5MzEzMjgwfQ.O-ueE6qH6QVhDbIiTtxRz32P_IgBRFLquDCABVJFA_c"

echo "📊 Applying schema to Supabase..."
echo ""

# Read the SQL file
SQL_CONTENT=$(cat supabase/schema.sql)

# Execute via REST API
curl -X POST "$SUPABASE_URL/rest/v1/rpc" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @- << EOF
{
  "query": "$SQL_CONTENT"
}
EOF

echo ""
echo "✅ Schema application complete!"
echo ""
echo "Next steps:"
echo "1. Verify tables in Supabase dashboard"
echo "2. Run: pnpm dev:web"
echo "3. Test authentication and CRUD operations"
