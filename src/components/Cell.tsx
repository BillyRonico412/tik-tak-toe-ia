import { useAtomValue, useSetAtom } from "jotai"
import { atoms } from "@/lib/atom"
import { tikTakToe } from "@/lib/tikTakToe"
import { cn } from "@/lib/utils"

export const Cell = (props: { index: number }) => {
	const board = useAtomValue(atoms.boardAtom)
	const playMove = useSetAtom(atoms.playMoveAtom)
	const cellValue = tikTakToe.getCellValue(board, props.index)
	const currentPlayer = useAtomValue(atoms.currentPlayerAtom)
	const lastIndex = useAtomValue(atoms.lastIndexAtom)
	const { winner, winningCombination } = useAtomValue(atoms.winAtom)
	const isCellWinning = winningCombination.includes(props.index)

	let cellSymbol: string | null = null
	if (cellValue === 1) {
		cellSymbol = "X"
	} else if (cellValue === 2) {
		cellSymbol = "O"
	}

	return (
		<div
			className={cn(
				"border aspect-square flex items-center justify-center text-4xl font-black",
				{
					"bg-primary/10": lastIndex === props.index,
					"text-muted-foreground": !!winner && !isCellWinning,
					"bg-green-600/25": isCellWinning,
				},
			)}
			onClick={() => {
				if (currentPlayer === tikTakToe.Player2) {
					return
				}
				playMove({ index: props.index })
			}}
		>
			{cellSymbol}
		</div>
	)
}
