type PresentCell = {
    isOpen: boolean
    round: number
    p: number
    isHome: boolean
    place: boolean
}

type PastCell = {
    wasOpen: boolean[]
    round: number[]
    p: number[]
    isHome: boolean
    place: boolean[]
}

export type TrackRound = {
    step: number
    placeCell: { row: number, cell: number }[]
    p: number[]
    score: number[]
}

export type GameCell =  PresentCell | PastCell

export type TBoard = GameCell[][]

