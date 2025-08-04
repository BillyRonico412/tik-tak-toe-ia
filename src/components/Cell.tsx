import { useAtomValue, useSetAtom } from "jotai"
import { tikTakToe } from "@/lib/atom"
import { cn } from "@/lib/utils"

export const Cell = (props: { index: number }) => {
	const board = useAtomValue(tikTakToe.boardAtom)
	const playMove = useSetAtom(tikTakToe.playMoveAtom)
	const cellValue = tikTakToe.getCellValue(board, props.index)
	const [winner, winningCombination] = useAtomValue(tikTakToe.winAtom)
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
					"bg-green-600/25": isCellWinning,
					"text-muted-foreground": !!winner && !isCellWinning,
				},
			)}
			onClick={() => {
				playMove({ index: props.index })
			}}
		>
			{cellSymbol}
		</div>
	)
}
