import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function seedAdminUser() {
  try {
    console.log("Creating admin user...")

    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const adminExists = existingUser?.users?.some((u) => u.email === "admin@totore.com")

    if (adminExists) {
      console.log("Admin user already exists")
      return
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: "admin@totore.com",
      password: "admin123456",
      email_confirm: true,
    })

    if (error) {
      console.error("Error creating admin user:", error)
      return
    }

    console.log("Admin user created successfully!")
    console.log("Email: admin@totore.com")
    console.log("Password: admin123456")
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

seedAdminUser()
