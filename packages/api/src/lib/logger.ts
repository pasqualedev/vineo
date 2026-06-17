import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
} as const

const METHOD_COLOR: Record<string, string> = {
  GET: C.cyan,
  POST: C.green,
  PUT: C.yellow,
  PATCH: C.magenta,
  DELETE: C.red,
  HEAD: C.gray,
  OPTIONS: C.gray,
}

const REDACT_KEYS = new Set(['password', 'token', 'authorization', 'apiKey', 'secret'])

function statusColor(status: number): string {
  if (status >= 500) return C.red
  if (status >= 400) return C.yellow
  if (status >= 300) return C.cyan
  return C.green
}

function formatDuration(ms: number): string {
  if (ms < 1) return `${ms.toFixed(2)}ms`
  if (ms < 1000) return `${ms.toFixed(0)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

function timestamp(): string {
  return new Date().toISOString().substring(11, 23)
}

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact)
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = REDACT_KEYS.has(k) ? '[REDACTED]' : redact(v)
    }
    return out
  }
  return value
}

function prettyBody(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null
  try {
    const json = JSON.stringify(redact(body), null, 2)
    return json
      .split('\n')
      .map((l) => `  ${C.dim}│${C.reset} ${l}`)
      .join('\n')
  } catch {
    return null
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    _logStart?: bigint
  }
}

interface RegisterLoggerOptions {
  logBodyMethods?: ReadonlyArray<string>
}

/**
 * Logger estilo Next.js dev para Fastify:
 * - linha colorida por método + status + duração
 * - body de POST/PUT/PATCH abaixo (com redaction de campos sensíveis)
 */
export function registerLogger(
  app: FastifyInstance,
  options: RegisterLoggerOptions = {},
): void {
  const bodyMethods = new Set(options.logBodyMethods ?? ['POST', 'PUT', 'PATCH'])

  app.addHook('onRequest', async (req: FastifyRequest) => {
    req._logStart = process.hrtime.bigint()
  })

  app.addHook('onResponse', async (req: FastifyRequest, reply: FastifyReply) => {
    const start = req._logStart
    const ns = start ? Number(process.hrtime.bigint() - start) : 0
    const ms = ns / 1_000_000
    const method = req.method
    const url = req.url
    const status = reply.statusCode

    const mc = METHOD_COLOR[method] ?? C.gray
    const sc = statusColor(status)

    const line =
      `${C.dim}${timestamp()}${C.reset} ` +
      `${mc}${C.bold}${method.padEnd(6)}${C.reset}` +
      `${C.bold}${url}${C.reset} ` +
      `${sc}${status}${C.reset} ` +
      `${C.dim}${formatDuration(ms)}${C.reset}`

    process.stdout.write(line + '\n')

    if (bodyMethods.has(method) && req.body) {
      const body = prettyBody(req.body)
      if (body) process.stdout.write(body + '\n')
    }
  })

  app.addHook('onError', async (_req, _reply, error) => {
    process.stdout.write(`  ${C.red}${C.bold}✖${C.reset} ${C.red}${error.message}${C.reset}\n`)
    if (error.stack) {
      const stackLines = error.stack.split('\n').slice(1, 4)
      for (const l of stackLines) {
        process.stdout.write(`  ${C.dim}${l.trim()}${C.reset}\n`)
      }
    }
  })
}

export function logReady(host: string, port: number): void {
  process.stdout.write(
    `\n${C.green}${C.bold}▲${C.reset} ${C.bold}Vineo API${C.reset} ${C.dim}ready on${C.reset} ` +
      `${C.cyan}http://${host}:${port}${C.reset}\n\n`,
  )
}
