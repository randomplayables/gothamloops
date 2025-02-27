type PresentCell = {
    value: string
    isOpen: boolean
    round: number
    p: number
}

type PastCell = {
    value: string
    wasOpen: boolean[]
    round: number[]
    p: number[]
}

export type GameCell =  PresentCell | PastCell

export type TBoard = GameCell[][]

