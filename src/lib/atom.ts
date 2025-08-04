import { atom } from "jotai"

const Empty = 0
const Player1 = 1
const Player2 = 2

type PlayerType = typeof Player1 | typeof Player2
type CellValueType = PlayerType | 0

const boardAtom = atom(Uint8Array.from(Array.from({ length: 9 }, () => Empty)))
const currentPlayerAtom = atom<PlayerType>(Player1)

const getCellValue = (board: Uint8Array, index: number): CellValueType => {
	return board[index] as CellValueType
}

const playMoveAtom = atom(null, (get, set, params: { index: number }) => {
	const [winner] = get(winAtom)
	if (winner) {
		return
	}
	const board = get(boardAtom)
	const newBoard = new Uint8Array(board)
	const currentPlayer = get(currentPlayerAtom)
	newBoard[params.index] = currentPlayer
	set(boardAtom, newBoard)
	set(currentPlayerAtom, currentPlayer === Player1 ? 0b10 : Player1)
})
const resetGameAtom = atom(null, (_, set) => {
	set(boardAtom, Uint8Array.from(Array.from({ length: 9 }, () => Empty)))
	set(currentPlayerAtom, Player1)
})

const getWin = (board: Uint8Array): [CellValueType, index: Uint8Array] => {
	const winningCombinations = [
		[0, 1, 2], // Row 1
		[3, 4, 5], // Row 2
		[6, 7, 8], // Row 3
		[0, 3, 6], // Column 1
		[1, 4, 7], // Column 2
		[2, 5, 8], // Column 3
		[0, 4, 8], // Diagonal \
		[2, 4, 6], // Diagonal /
	] as const

	for (const combination of winningCombinations) {
		const [indexA, indexB, indexC] = combination
		const valueA = getCellValue(board, indexA)
		const valueB = getCellValue(board, indexB)
		const valueC = getCellValue(board, indexC)

		if (valueA !== 0 && valueA === valueB && valueA === valueC) {
			return [valueA, new Uint8Array(combination)]
		}
	}
	return [0 as PlayerType, new Uint8Array()]
}

const winAtom = atom((get) => {
	return getWin(get(boardAtom))
})

export const tikTakToe = {
	boardAtom,
	currentPlayerAtom,
	playMoveAtom,
	resetGameAtom,
	winAtom,
	getCellValue,
	Player1,
	Player2,
}
