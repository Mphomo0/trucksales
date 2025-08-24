import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

interface UpdateData {
  name?: string
  email?: string
  password?: string
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, email, password } = await req.json()
    const updateData: UpdateData = {}

    // Update name if provided
    if (name) updateData.name = name

    // Email update logic
    if (email && email !== session.user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }

      const normalizedEmail = email.toLowerCase()

      const existingUser = await prisma.users.findUnique({
        where: { email: normalizedEmail },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        )
      }

      updateData.email = normalizedEmail
    }

    // Password update logic
    if (password && password.length > 0) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }

      updateData.password = await hash(password, 10)
    }

    // No fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: 'No changes to update' },
        { status: 200 }
      )
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { email: session.user.email },
      data: updateData,
      select: { id: true, name: true, email: true },
    })

    // Optionally: alert the client if re-login is needed after email change
    const emailChanged =
      !!updateData.email && updateData.email !== session.user.email

    return NextResponse.json(
      {
        success: true,
        user: updatedUser,
        ...(emailChanged && {
          message: 'Email changed. Please re-login to continue.',
        }),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(
      '[UPDATE_PROFILE_ERROR]',
      error instanceof Error ? error.message : error
    )

    return NextResponse.json(
      {
        error: 'Failed to update profile',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}
