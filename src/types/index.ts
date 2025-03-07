import { LEVELS } from "../constants"

type PresentCell = {
    isOpen: boolean
    round: number
    p: number
    isHome: boolean
    place: boolean
    highlight?: "red" | "green" | null
}

type PastCell = {
    isOpen: boolean[] //In earlier drafts this was wasOpen
    round: number[]
    p: number[]
    isHome: boolean
    place: boolean[]
    highlight?: string[]
}

export type TrackRound = {
    step: number
    placeCell: { row: number, cell: number }[]
    p: number[]
    score: number[]
}

export type MultiRoundTrack = {
    rounds: {
        roundNumber: number;
        roundHistory: TrackRound;
        finalScore: number;
    }[];
};

export type GameCell =  PresentCell | PastCell

export type TBoard = GameCell[][]

export type TLevel = keyof typeof LEVELS
