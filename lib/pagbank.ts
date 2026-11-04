import 'server-only'
import { createHmac, timingSafeEqual } from 'crypto'
import { randomUUID } from 'crypto'

const BASE_URL =
  process.env.PAGBANK_ENVIRONMENT === 'production'
    ? 'https://api.pagseguro.com'
    : 'https://sandbox.api.pagseguro.com'

function getToken(): string {
  const token = process.env.PAGBANK_TOKEN
  if (!token) throw new Error('PAGBANK_TOKEN is not configured')
  return token
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PagBankCheckoutItem {
  reference_id: string
  name: string
  quantity: number
  unit_amount: number // in centavos (e.g. R$50,00 = 5000)
}

export interface PagBankRecurrencePlan {
  name: string
  interval: {
    unit: 'DAY' | 'MONTH' | 'YEAR'
    length: number
  }
  /** Number of billing cycles. Omit for indefinite (no expiration). */
  billing_cycles?: number
}

export interface PagBankCheckoutRequest {
  reference_id: string
  expiration_date: string
  items: PagBankCheckoutItem[]
  payment_methods: Array<{ type: string }>
  redirect_url: string
  notification_urls: string[]
  metadata?: Record<string, string>
  /** Include to create a Checkout Recorrente (recurring subscription). Credit card only. */
  recurrence_plan?: PagBankRecurrencePlan
}

export interface PagBankCheckoutResponse {
  id: string
  reference_id: string
  status: string
  links: Array<{ rel: string; href: string; media: string; type: string }>
}

export interface PagBankChargeAmount {
  value: number
  currency: string
  summary?: { total: number; paid: number; refunded: number }
}

export interface PagBankCharge {
  id: string
  reference_id: string
  status: 'AUTHORIZED' | 'PAID' | 'IN_ANALYSIS' | 'DECLINED' | 'CANCELLED' | string
  paid_at?: string
  amount: PagBankChargeAmount
  payment_method?: { type: string }
  metadata?: Record<string, string>
}

export interface PagBankOrder {
  id: string
  reference_id: string
  status: string
  created_at: string
  customer?: { name: string; email: string; tax_id?: string }
  charges: PagBankCharge[]
  metadata?: Record<string, string | undefined>
}

export interface PagBankWebhookPayload {
  id: string
  created_at: string
  type: string
  schema?: string
  data: {
    id: string
    reference_id?: string
    status?: string
    charges?: PagBankCharge[]
  }
}

// ─── HTTP client ─────────────────────────────────────────────────────────────

async function pagbankRequest<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const token = getToken()
  const url = `${BASE_URL}${path}`

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const responseText = await response.text()

  // Never log the request body or the response body: both carry donor data.
  // A GET /orders response includes customer.name, customer.email and
  // customer.tax_id (CPF). Method, path and status are enough to trace a call.
  console.log(`[PagBank] ${method} ${path} -> ${response.status}`)

  if (!response.ok) {
    throw new Error(`PagBank API error ${response.status}: ${responseText}`)
  }

  return JSON.parse(responseText) as T
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Generate a unique reference ID for a payment. */
export function generateReferenceId(): string {
  return `maya-${randomUUID()}`
}

/**
 * Create a hosted PagBank Checkout session.
 * Returns the response including the redirect link (rel = "PAY").
 */
export async function createCheckout(
  req: PagBankCheckoutRequest
): Promise<PagBankCheckoutResponse> {
  return pagbankRequest<PagBankCheckoutResponse>('POST', '/checkouts', req)
}

/**
 * Extract the hosted checkout redirect URL from the response links array.
 */
export function getCheckoutUrl(response: PagBankCheckoutResponse): string {
  const payLink = response.links.find((l) => l.rel === 'PAY')
  if (!payLink) throw new Error('PagBank checkout PAY link not found in response')
  return payLink.href
}

/**
 * Retrieve order details by PagBank order ID.
 */
export async function retrieveOrder(orderId: string): Promise<PagBankOrder> {
  return pagbankRequest<PagBankOrder>('GET', `/orders/${orderId}`)
}

/**
 * Find an order by our internal reference_id.
 * PagBank supports filtering: GET /orders?reference_id=...
 */
export async function findOrderByReference(referenceId: string): Promise<PagBankOrder | null> {
  try {
    const result = await pagbankRequest<{ orders: PagBankOrder[] }>(
      'GET',
      `/orders?reference_id=${encodeURIComponent(referenceId)}`
    )
    return result.orders?.[0] ?? null
  } catch {
    return null
  }
}

/**
 * Verify the HMAC-SHA256 signature on incoming PagBank webhook notifications.
 * PagBank sends the signature in the `x-pagbank-signature` header.
 */
export function validateWebhookSignature(body: string, signature: string | null): boolean {
  const isProduction = process.env.PAGBANK_ENVIRONMENT === 'production'
  const webhookToken = process.env.PAGBANK_WEBHOOK_TOKEN

  if (!webhookToken) {
    // In production an unconfigured token must never mean "accept everything":
    // this endpoint is public, unauthenticated and writes with the service role
    // key. Fail closed. Outside production, allow it so local dev and the
    // sandbox keep working without a token.
    return !isProduction
  }

  if (!signature) {
    // PagBank sandbox does not send the x-pagbank-signature header.
    // Allow unsigned webhooks in sandbox; reject in production.
    return !isProduction
  }

  // PagBank sends the webhook token directly in the x-pagbank-signature header (not HMAC).
  // Compare using timingSafeEqual to prevent timing attacks.
  try {
    const sigBuf = Buffer.from(signature)
    const tokBuf = Buffer.from(webhookToken)
    if (sigBuf.length !== tokBuf.length) return false
    return timingSafeEqual(sigBuf, tokBuf)
  } catch {
    return false
  }
}

/**
 * Suspend an active PagBank subscription.
 * PUT /subscriptions/{id}/suspend
 */
export async function suspendSubscription(subscriptionId: string): Promise<void> {
  await pagbankRequest('PUT', `/subscriptions/${subscriptionId}/suspend`)
}

/**
 * Activate (resume) a suspended PagBank subscription.
 * PUT /subscriptions/{id}/activate
 */
export async function activateSubscription(subscriptionId: string): Promise<void> {
  await pagbankRequest('PUT', `/subscriptions/${subscriptionId}/activate`)
}

/**
 * Cancel a PagBank subscription permanently.
 * PUT /subscriptions/{id}/cancel
 */
export async function cancelPagBankSubscription(subscriptionId: string): Promise<void> {
  await pagbankRequest('PUT', `/subscriptions/${subscriptionId}/cancel`)
}

/**
 * Change the amount of an active PagBank subscription.
 * PATCH /subscriptions/{id}
 */
export async function updateSubscriptionAmount(
  subscriptionId: string,
  newAmountCentavos: number
): Promise<void> {
  await pagbankRequest('PATCH', `/subscriptions/${subscriptionId}`, {
    amount: { value: newAmountCentavos },
  })
}

/**
 * Map a PagBank order status / charge status to our internal donation status.
 */
export function mapChargeStatus(
  charge: PagBankCharge
): 'completed' | 'pending' | 'failed' | 'cancelled' {
  switch (charge.status) {
    case 'PAID':
      return 'completed'
    case 'AUTHORIZED':
    case 'IN_ANALYSIS':
      return 'pending'
    case 'DECLINED':
      return 'failed'
    case 'CANCELLED':
      return 'cancelled'
    default:
      return 'pending'
  }
}
