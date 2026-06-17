import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/** Rascunho da garrafa em construção ao longo do wizard de adição. */
export interface AddBottleDraft {
  readonly cellarId: string | null
  readonly barcode: string | null
  readonly rawOcrText: string | null
  readonly row: number | null
  readonly col: number | null
}

const EMPTY_DRAFT: AddBottleDraft = {
  cellarId: null,
  barcode: null,
  rawOcrText: null,
  row: null,
  col: null,
}

interface AddBottleDraftContextValue {
  readonly draft: AddBottleDraft
  readonly update: (patch: Partial<AddBottleDraft>) => void
  readonly reset: () => void
}

const AddBottleDraftContext = createContext<AddBottleDraftContextValue | null>(null)

/**
 * Provider do rascunho da garrafa. Deve envolver as telas do wizard
 * (`app/add/_layout.tsx`).
 */
export function AddBottleDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<AddBottleDraft>(EMPTY_DRAFT)

  const update = useCallback((patch: Partial<AddBottleDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }))
  }, [])

  const reset = useCallback(() => setDraft(EMPTY_DRAFT), [])

  const value = useMemo(() => ({ draft, update, reset }), [draft, update, reset])

  return (
    <AddBottleDraftContext.Provider value={value}>
      {children}
    </AddBottleDraftContext.Provider>
  )
}

/** Acessa o rascunho da garrafa. Lança se usado fora do provider. */
export function useAddBottleDraft(): AddBottleDraftContextValue {
  const context = useContext(AddBottleDraftContext)
  if (!context) {
    throw new Error('useAddBottleDraft deve ser usado dentro de AddBottleDraftProvider')
  }
  return context
}
