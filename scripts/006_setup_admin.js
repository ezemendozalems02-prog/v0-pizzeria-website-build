import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin user...')

    // Create admin user with auth
    const { data: user, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@totore.com',
      password: 'admin123456',
      email_confirm: true,
    })

    if (authError && !authError.message.includes('already exists')) {
      throw authError
    }

    if (user?.user?.id) {
      console.log('✅ Admin user created:', user.user.email)
    } else {
      console.log('ℹ️  Admin user already exists')
    }

    console.log('\n✅ Admin setup complete!')
    console.log('📧 Email: admin@totore.com')
    console.log('🔐 Password: admin123456')
    console.log('\n⚠️  Change the password immediately after first login!')
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message)
    process.exit(1)
  }
}

setupAdmin()
