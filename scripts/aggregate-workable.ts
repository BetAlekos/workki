import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local from project root
config({ path: resolve(process.cwd(), '.env.local') })

import { WORKABLE_COMPANIES, type WorkableCompany } from '../lib/workable-companies'
import { verifyCompany, runAggregator } from '../lib/workable-aggregator'

async function verifyAll(): Promise<WorkableCompany[]> {
  console.log('🔍 Verifying companies on Workable...\n')
  const verified: WorkableCompany[] = []

  // Run verifications in parallel batches of 5 to be polite
  for (let i = 0; i < WORKABLE_COMPANIES.length; i += 5) {
    const batch = WORKABLE_COMPANIES.slice(i, i + 5)
    const results = await Promise.all(
      batch.map(async (company) => {
        const found = await verifyCompany(company.slug)
        return { company, found }
      })
    )
    for (const { company, found } of results) {
      if (found) {
        console.log(`  ✓ ${company.name} (${company.slug})`)
        verified.push(company)
      } else {
        console.log(`  ✗ Not found: ${company.slug}`)
      }
    }
  }

  console.log(`\n${verified.length}/${WORKABLE_COMPANIES.length} companies verified.\n`)
  console.log('─'.repeat(50))
  return verified
}

async function main() {
  const verifiedCompanies = await verifyAll()

  if (verifiedCompanies.length === 0) {
    console.log('No companies verified. Exiting.')
    process.exit(0)
  }

  console.log('\n🚀 Starting aggregation...\n')
  const start = Date.now()

  // Override the companies list for this run with only verified ones
  const result = await runAggregator(console.log, verifiedCompanies)

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
