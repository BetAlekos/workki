import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local from project root
config({ path: resolve(process.cwd(), '.env.local') })

import { WORKABLE_COMPANIES } from '../lib/workable-companies'
import { runAggregator } from '../lib/workable-aggregator'

async function main() {
  console.log(`🚀 Starting Workable aggregator (${WORKABLE_COMPANIES.length} companies)...\n`)
  const start = Date.now()

  // runAggregator handles verification inline:
  // - 404 → logs "✗ Not on Workable: {slug}" and skips
  // - 200 → logs job count and processes
  const result = await runAggregator(console.log)

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`\n✅ Done in ${elapsed}s`)
  console.log(`   Added:   ${result.added} new jobs`)
  console.log(`   Skipped: ${result.skipped} existing jobs`)

  if (result.errors.length > 0) {
    console.log(`\n⚠ Errors (${result.errors.length}):`)
    result.errors.forEach((e) => console.log(`  - ${e}`))
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
