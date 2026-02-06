'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/lib/payload'

interface InquiryFormProps {
  product?: Product | null
}

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

export function InquiryForm({ product }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          productId: product?.id || null,
          productTitle: product?.title || null,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'A apărut o eroare. Te rugăm să încerci din nou.')
      }

      setIsSuccess(true)
      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-xl bg-green-50 p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-900">Cerere trimisă cu succes!</h3>
        <p className="mt-2 text-green-700">
          Te vom contacta în cel mai scurt timp posibil.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-4 text-sm font-medium text-green-600 hover:text-green-700"
        >
          Trimite o altă cerere
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {product && (
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Produs selectat:</p>
          <p className="font-medium text-gray-900">{product.title}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
          Nume complet *
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Numele este obligatoriu' })}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="Ion Popescu"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email-ul este obligatoriu',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email invalid',
            },
          })}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="email@exemplu.ro"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
          Telefon *
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone', { required: 'Telefonul este obligatoriu' })}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="07XX XXX XXX"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">
          Mesaj (opțional)
        </label>
        <textarea
          id="message"
          rows={4}
          {...register('message')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="Detalii suplimentare despre cererea ta..."
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Se trimite...' : 'Trimite cererea'}
      </Button>
    </form>
  )
}
