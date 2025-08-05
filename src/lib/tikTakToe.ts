const Empty = 0 as const
const Player1 = 1 as const
const Player2 = 2 as const
const Size = 3 as const
const NbCells = Size * Size

export type PlayerType = typeof Player1 | typeof Player2
export type CellValueType = PlayerType | 0

const oppositePlayer = (player: PlayerType): PlayerType => {
	return player === Player1 ? Player2 : Player1
}

const getCellValue = (board: Uint8Array, index: number): CellValueType => {
	return board[index] as CellValueType
}

const isDraw = (board: Uint8Array): boolean => {
	return !board.includes(Empty) && getWin(board).winner === Empty
}

const getWin = (
	board: Uint8Array,
): {
	winner: CellValueType
	winningCombination: Uint8Array
} => {
	const winningCombinations: Uint8Array[] = []
	for (let i = 0; i < Size; i++) {
		for (let j = 0; j < Size; j++) {
			if (i + 2 < Size) {
				winningCombinations.push(
					new Uint8Array([
						i * Size + j,
						(i + 1) * Size + j,
						(i + 2) * Size + j,
					]),
				) // Vertical
			}
			if (j + 2 < Size) {
				winningCombinations.push(
					new Uint8Array([
						i * Size + j,
						i * Size + (j + 1),
						i * Size + (j + 2),
					]),
				) // Horizontal
			}
			if (i + 2 < Size && j + 2 < Size) {
				winningCombinations.push(
					new Uint8Array([
						i * Size + j,
						(i + 1) * Size + (j + 1),
						(i + 2) * Size + (j + 2),
					]),
				) // Diagonal \
			}
			if (i + 2 < Size && j - 2 >= 0) {
				winningCombinations.push(
					new Uint8Array([
						i * Size + j,
						(i + 1) * Size + (j - 1),
						(i + 2) * Size + (j - 2),
					]),
				) // Diagonal /
			}
		}
	}

	for (const combination of winningCombinations) {
		const [indexA, indexB, indexC] = combination
		const valueA = getCellValue(board, indexA)
		const valueB = getCellValue(board, indexB)
		const valueC = getCellValue(board, indexC)

		if (valueA !== Empty && valueA === valueB && valueA === valueC) {
			return {
				winner: valueA,
				winningCombination: new Uint8Array(combination),
			}
		}
	}
	return {
		winner: Empty,
		winningCombination: new Uint8Array(),
	}
}

type Node = {
	parent?: Node
	board: Uint8Array
	children: Node[]
	weight: number
}

const getDepth = (node: Node): number => {
	if (!node.parent) {
		return 0
	}
	return 1 + getDepth(node.parent)
}

const getBestMoveIndex = (board: Uint8Array): number => {
	const emptyIndices: Uint8Array = new Uint8Array(board.length)
	for (let i = 0; i < board.length; i++) {
		if (board[i] === Empty) {
			emptyIndices[i] = 1
		}
	}
	let nbEmptyCells = 0
	for (let i = 0; i < emptyIndices.length; i++) {
		if (emptyIndices[i] === 1) {
			nbEmptyCells++
		}
	}
	const maxDepth = Math.min(3, nbEmptyCells)
	const root: Node = {
		board,
		children: [],
		parent: undefined,
		weight: 0,
	}
	const minimax = (
		node: Node,
		currentPlayer: PlayerType,
		depth: number,
	): void => {
		const { winner } = getWin(node.board)
		if (winner === Player1) {
			node.weight = -(nbEmptyCells - getDepth(node) + 1)
			return
		}
		if (winner === Player2) {
			node.weight = nbEmptyCells - getDepth(node) + 1
			return
		}
		if (depth === 0) {
			node.weight = 0
			return
		}
		for (let i = 0; i < node.board.length; i++) {
			if (node.board[i] !== Empty) {
				continue
			}
			const newBoard = new Uint8Array(node.board)
			newBoard[i] = currentPlayer
			const childNode: Node = {
				board: newBoard,
				children: [],
				parent: node,
				weight: 0,
			}
			minimax(childNode, oppositePlayer(currentPlayer), depth - 1)
			node.children.push(childNode)
		}
		if (node.children.length === 0) {
			node.weight = 0
			return
		}
		if (currentPlayer === Player2) {
			node.weight = Math.max(...node.children.map((c) => c.weight))
		} else {
			node.weight = Math.min(...node.children.map((c) => c.weight))
		}
	}
	minimax(root, Player2, maxDepth)
	console.log(root)
	const bestMoves = root.children.filter(
		(child) => child.weight === root.weight,
	)
	if (bestMoves.length === 0) {
		return -1
	}
	const bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)]
	for (let i = 0; i < board.length; i++) {
		if (bestMove.board[i] !== board[i]) {
			return i
		}
	}
	return -1
}

export const tikTakToe = {
	Size,
	NbCells,
	Empty,
	Player1,
	Player2,
	getCellValue,
	getWin,
	getBestMoveIndex,
	isDraw,
}
