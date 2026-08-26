/**
 * Data Seeding Script: seed_distinct_users.js
 * Generates and seeds 15 highly distinct user profiles with diverse roles,
 * subscription tiers, company metadata, and historical creation dates.
 * 
 * Supports both direct Supabase ingestion and JSON export for verifiable mock state.
 */

const fs = require('fs');
const path = require('path');

const DISTINCT_USERS = [
  {
    id: "usr-001-dev-core",
    wallet_address: "GBDEV7Y7Z2NKY35PQVVR3GMLKXTY7P4JNXHQ7L32Z6PZJ4W5KLMNOPQR",
    name: "Alex Rivera",
    role: "Core Developer",
    company: "Stellar Horizon Labs",
    subscription_tier: "Enterprise",
    monthly_volume_xlm: 45000,
    avatar_color: "#06b6d4",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=AlexRivera",
    created_at: "2024-03-01T08:15:00Z",
    status: "active"
  },
  {
    id: "usr-002-ent-fin",
    wallet_address: "GCENT8K2W3MXL78QPVVR5HMLKYTZ8P5JMXHQ8L33Z7PZK5W6ABCDEFGH",
    name: "Helena Vance",
    role: "Enterprise Lead",
    company: "Vanguard Global Capital",
    subscription_tier: "Enterprise",
    monthly_volume_xlm: 120000,
    avatar_color: "#10b981",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=HelenaVance",
    created_at: "2024-03-15T10:30:00Z",
    status: "verified"
  },
  {
    id: "usr-003-dao-gov",
    wallet_address: "GDAOG4M9X1NYK24PQVVR1JMLKXTX4P2JNXHQ4L30Z4PZI2W3IJKLMNOP",
    name: "Marcus Aurelius",
    role: "DAO Governor",
    company: "Solaris Governance DAO",
    subscription_tier: "Pro",
    monthly_volume_xlm: 25000,
    avatar_color: "#a855f7",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=MarcusDAO",
    created_at: "2024-04-02T14:20:00Z",
    status: "active"
  },
  {
    id: "usr-004-defi-res",
    wallet_address: "GDFI5P2Q8W1MYK93PQVVR2KMLKXTY6P1JNXHQ5L31Z5PZJ3W4QRSTUVWX",
    name: "Dr. Elena Rostova",
    role: "DeFi Protocol Researcher",
    company: "Soroban Quantum Research",
    subscription_tier: "Pro",
    monthly_volume_xlm: 35000,
    avatar_color: "#f43f5e",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=ElenaResearch",
    created_at: "2024-04-18T09:45:00Z",
    status: "verified"
  },
  {
    id: "usr-005-cre-art",
    wallet_address: "GART3N6K5X8MYK72PQVVR9LMLKXTY9P8JNXHQ3L29Z3PZH1W2YZABCDEF",
    name: "Sora Takahashi",
    role: "NFT & Digital Creator",
    company: "Neo-Tokyo Canvas Studios",
    subscription_tier: "Starter",
    monthly_volume_xlm: 4200,
    avatar_color: "#f59e0b",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=SoraArt",
    created_at: "2024-05-04T16:10:00Z",
    status: "active"
  },
  {
    id: "usr-006-val-nod",
    wallet_address: "GVAL9L1M4Z7NYK51PQVVR8MMLKXTY3P7JNXHQ9L35Z9PZM7W8GHIJKLMN",
    name: "Klaus Weber",
    role: "Validator Node Operator",
    company: "Alpine Tier-1 Stellar Nodes",
    subscription_tier: "Enterprise",
    monthly_volume_xlm: 98000,
    avatar_color: "#3b82f6",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=KlausNode",
    created_at: "2024-05-22T11:00:00Z",
    status: "verified"
  },
  {
    id: "usr-007-dev-con",
    wallet_address: "GCON2M8K6W5NYK39PQVVR7NMLKXTY5P6JNXHQ2L28Z2PZG0W1OPQRSTUV",
    name: "Priya Sharma",
    role: "Smart Contract Auditor",
    company: "CertiX Soroban Security",
    subscription_tier: "Enterprise",
    monthly_volume_xlm: 75000,
    avatar_color: "#14b8a6",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=PriyaSecurity",
    created_at: "2024-06-08T13:40:00Z",
    status: "verified"
  },
  {
    id: "usr-008-pay-gat",
    wallet_address: "GPAY1K4L9Z2NYK18PQVVR6OMLKXTY2P5JNXHQ1L27Z1PZF9W0WXYZABCD",
    name: "Tariq Al-Mansoor",
    role: "Fintech Gateway Lead",
    company: "Oasis Cross-Border Remit",
    subscription_tier: "Enterprise",
    monthly_volume_xlm: 210000,
    avatar_color: "#6366f1",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=TariqFintech",
    created_at: "2024-06-25T15:30:00Z",
    status: "verified"
  },
  {
    id: "usr-009-sta-fnd",
    wallet_address: "GSTA8L5M3Y1NYK97PQVVR5PMLKXTY8P4JNXHQ8L34Z8PZL6W7EFGHIJKL",
    name: "Camila Torres",
    role: "Web3 Startup Founder",
    company: "StellarPay Mobile",
    subscription_tier: "Pro",
    monthly_volume_xlm: 18500,
    avatar_color: "#ec4899",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=CamilaStartup",
    created_at: "2024-07-03T07:50:00Z",
    status: "active"
  },
  {
    id: "usr-010-edu-aca",
    wallet_address: "GEDU7K2L8X9NYK86PQVVR4QMLKXTY1P3JNXHQ7L33Z7PZK5W6MNOPQRST",
    name: "Prof. Arthur Pendelton",
    role: "Blockchain Academic",
    company: "Soroban Rust Academy",
    subscription_tier: "Starter",
    monthly_volume_xlm: 2900,
    avatar_color: "#84cc16",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=ArthurAcademy",
    created_at: "2024-07-19T12:15:00Z",
    status: "active"
  },
  {
    id: "usr-011-wha-inv",
    wallet_address: "GWHA6M9K7W8NYK75PQVVR3RMLKXTY7P2JNXHQ6L32Z6PZJ4W5UVWXYZAB",
    name: "Lord Stirling",
    role: "Angel Web3 Investor",
    company: "Aegis Decentralized Ventures",
    subscription_tier: "Enterprise",
    monthly_volume_xlm: 500000,
    avatar_color: "#eab308",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=LordStirling",
    created_at: "2024-08-01T17:05:00Z",
    status: "verified"
  },
  {
    id: "usr-012-gam-stu",
    wallet_address: "GGAM5L6M4V7NYK64PQVVR2SMLKXTY4P1JNXHQ5L31Z5PZI3W4CDEFGHIJ",
    name: "Kenji Sato",
    role: "Web3 Game Architect",
    company: "Hyperion Stellar Gaming",
    subscription_tier: "Pro",
    monthly_volume_xlm: 42000,
    avatar_color: "#0ea5e9",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=KenjiGaming",
    created_at: "2024-08-10T10:40:00Z",
    status: "active"
  },
  {
    id: "usr-013-dao-tre",
    wallet_address: "GTRE4K3L2U6NYK53PQVVR1TMLKXTY9P0JNXHQ4L30Z4PZH2W3KLMNOPQR",
    name: "Genevieve Dubois",
    role: "DAO Treasury Signer",
    company: "Lumina Community Treasury",
    subscription_tier: "Enterprise",
    monthly_volume_xlm: 160000,
    avatar_color: "#d946ef",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=GenevieveTreasury",
    created_at: "2024-08-16T14:55:00Z",
    status: "verified"
  },
  {
    id: "usr-014-ind-hck",
    wallet_address: "GHCK3M1K9T5NYK42PQVVR0UMLKXTY6P9JNXHQ3L29Z3PZG1W2STUVWXYZ",
    name: "Devon Clark",
    role: "Indie Hacker",
    company: "MicroSaaS Soroban Suite",
    subscription_tier: "Starter",
    monthly_volume_xlm: 1500,
    avatar_color: "#f97316",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=DevonIndie",
    created_at: "2024-08-21T09:20:00Z",
    status: "active"
  },
  {
    id: "usr-015-inf-sec",
    wallet_address: "GSEC2L8J8S4NYK31PQVVQ9VMLKXTY3P8JNXHQ2L28Z2PZF0W1ABCDEFGH",
    name: "Nadia Volkov",
    role: "Infra Security Lead",
    company: "ZeroDay Stellar Shield",
    subscription_tier: "Enterprise",
    monthly_volume_xlm: 88000,
    avatar_color: "#8b5cf6",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=NadiaSecurity",
    created_at: "2024-08-25T11:35:00Z",
    status: "verified"
  }
];

async function seedUsers() {
  console.log("🌱 Starting Distinct User Profiles Seeding Process...");
  console.log(`Generated ${DISTINCT_USERS.length} distinct monthly active users with differentiated metadata.`);

  // Save to local JSON artifact
  const outputPath = path.join(__dirname, 'seeded_distinct_users.json');
  fs.writeFileSync(outputPath, JSON.stringify(DISTINCT_USERS, null, 2));
  console.log(`✅ Seed dataset successfully written to: ${outputPath}`);

  // Check for Supabase configuration
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      console.log(`🔗 Connecting to Supabase at ${supabaseUrl}...`);
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase
        .from('profiles')
        .upsert(DISTINCT_USERS, { onConflict: 'wallet_address' });

      if (error) {
        console.warn("⚠️ Supabase insertion encountered an error (falling back to JSON store):", error.message);
      } else {
        console.log("🚀 Successfully synchronized 15 distinct profiles to Supabase database!");
      }
    } catch (e) {
      console.warn("⚠️ Supabase client unavailable or failed to connect:", e.message);
    }
  } else {
    console.log("ℹ️ SUPABASE_URL not configured in environment. Using generated distinct profile dataset.");
  }

  console.log("\n📊 Summary of Distinct Users Seeded:");
  DISTINCT_USERS.forEach((u, i) => {
    console.log(`  [${i + 1}] ${u.name.padEnd(24)} | ${u.role.padEnd(25)} | Tier: ${u.subscription_tier.padEnd(10)} | Vol: ${u.monthly_volume_xlm.toLocaleString()} XLM`);
  });

  console.log("\n✨ Seeding completed successfully.");
}

if (require.main === module) {
  seedUsers();
}

module.exports = { DISTINCT_USERS, seedUsers };
