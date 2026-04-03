import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAnonServerClient } from '@/lib/supabase-server'
import { UserRole } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createAnonServerClient()

    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, email, role, is_active, created_at')
      .eq('role', 'secretary')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createAnonServerClient()

    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, role } = body

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      )
    }

    if (!['secretary', 'technician'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be secretary or technician' },
        { status: 400 }
      )
    }

    const adminSupabase = await createServerSupabaseClient()

    const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    if (newUser.user) {
      const { error: profileError } = await adminSupabase
        .from('profiles')
        .insert({
          id: newUser.user.id,
          email,
          role: role as UserRole,
          is_active: true,
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        await adminSupabase.auth.admin.deleteUser(newUser.user.id)
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, user: newUser.user })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
