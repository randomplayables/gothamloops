type PresentCell = {
    value: string
    isOpen: boolean
    round: number
    p: number
    isHome: boolean
}

type PastCell = {
    value: string
    wasOpen: boolean[]
    round: number[]
    p: number[]
    isHome: boolean
}

export type GameCell =  PresentCell | PastCell

export type TBoard = GameCell[][]

