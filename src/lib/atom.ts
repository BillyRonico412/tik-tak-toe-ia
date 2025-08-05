import { atom } from "jotai"
import { atomEffect } from "jotai-effect"
import { type PlayerType, tikTakToe } from "@/lib/tikTakToe"

const boardAtom = atom(
	Uint8Array.from(Array.from({ length: 9 }, () => tikTakToe.Empty)),
)
const currentPlayerAtom = atom<PlayerType>(tikTakToe.Player1)
const lastIndexAtom = atom(-1)
const playMoveAtom = atom(null, (get, set, params: { index: number }) => {
	clearTimeout(aiTimeout)
	const [winner] = get(winAtom)
	if (winner) {
		return
	}
	const board = get(boardAtom)
	const newBoard = new Uint8Array(board)
	const currentPlayer = get(currentPlayerAtom)
	const cellValue = tikTakToe.getCellValue(board, params.index)
	if (cellValue !== tikTakToe.Empty) {
		return
	}
	newBoard[params.index] = currentPlayer
	set(lastIndexAtom, params.index)
	set(boardAtom, newBoard)
	set(
		currentPlayerAtom,
		currentPlayer === tikTakToe.Player1 ? 0b10 : tikTakToe.Player1,
	)
})
const resetGameAtom = atom(null, (_, set) => {
	set(
		boardAtom,
		Uint8Array.from(Array.from({ length: 9 }, () => tikTakToe.Empty)),
	)
	set(currentPlayerAtom, tikTakToe.Player1)
})

const winAtom = atom((get) => {
	return tikTakToe.getWin(get(boardAtom))
})
let aiTimeout = 0
const aiPlayMoveEffect = atomEffect((get, set) => {
	if (get(currentPlayerAtom) !== tikTakToe.Player2) {
		return
	}
	const board = get.peek(boardAtom)
	const bestMoveIndex = tikTakToe.getBestMoveIndex(board)
	aiTimeout = window.setTimeout(() => {
		set(playMoveAtom, { index: bestMoveIndex })
	}, 500)
	return () => {
		window.clearTimeout(aiTimeout)
		aiTimeout = 0
	}
})

export const atoms = {
	boardAtom,
	currentPlayerAtom,
	playMoveAtom,
	resetGameAtom,
	winAtom,
	lastIndexAtom,
	aiPlayMoveEffect,
}
