import { useAtomValue } from "jotai"
import { tikTakToe } from "@/lib/atom"

export const CurrentPlayer = () => {
	const currentPlayer = useAtomValue(tikTakToe.currentPlayerAtom)
	const [winner] = useAtomValue(tikTakToe.winAtom)
	if (!winner) {
		return (
			<div className="font-medium text-lg">
				{currentPlayer === tikTakToe.Player1 ? "X" : "O"} is playing
			</div>
		)
	}
	return (
		<div className="font-medium text-lg">
			{winner === tikTakToe.Player1 ? "X" : "O"} wins!
		</div>
	)
}
