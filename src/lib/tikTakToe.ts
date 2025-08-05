const Empty = 0 as const
const Player1 = 1 as const
const Player2 = 2 as const

export type PlayerType = typeof Player1 | typeof Player2
export type CellValueType = PlayerType | 0

const getCellValue = (board: Uint8Array, index: number): CellValueType => {
	return board[index] as CellValueType
}

const getWin = (
	board: Uint8Array,
): [winner: CellValueType, indices: Uint8Array] => {
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
	const root: Node = {
		board,
		children: [],
		parent: undefined,
		weight: 0,
	}
	const genChildren = (node: Node, player: PlayerType): void => {
		const [winner] = getWin(node.board)
		if (winner === Player1 || winner === Player2) {
			return
		}
		for (let i = 0; i < node.board.length; i++) {
			if (node.board[i] !== Empty) {
				continue
			}
			const newBoard = new Uint8Array(node.board)
			newBoard[i] = player
			const childNode: Node = {
				board: newBoard,
				children: [],
				parent: node,
				weight: 0,
			}
			genChildren(childNode, player === Player1 ? Player2 : Player1)
			node.children.push(childNode)
		}
	}
	genChildren(root, Player2)
	const genWeight = (node: Node, player: PlayerType) => {
		if (node.children.length === 0) {
			const [winner] = getWin(node.board)
			if (winner === Player2) {
				node.weight = nbEmptyCells - getDepth(node) + 1
			} else if (winner === Player1) {
				node.weight = -(nbEmptyCells - getDepth(node)) + 1
			} else {
				node.weight = 0
			}
			return node
		}
		for (const child of node.children) {
			genWeight(child, player === Player1 ? Player2 : Player1)
		}
		if (player === Player2) {
			node.weight = Math.max(...node.children.map((c) => c.weight))
		} else {
			node.weight = Math.min(...node.children.map((c) => c.weight))
		}
	}
	genWeight(root, Player2)
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
	Empty,
	Player1,
	Player2,
	getCellValue,
	getWin,
	getBestMoveIndex,
}
