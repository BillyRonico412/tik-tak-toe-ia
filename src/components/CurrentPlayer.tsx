import { useAtomValue } from "jotai"
import { atoms } from "@/lib/atom"
import { tikTakToe } from "@/lib/tikTakToe"

export const CurrentPlayer = () => {
	const currentPlayer = useAtomValue(atoms.currentPlayerAtom)
	const [winner] = useAtomValue(atoms.winAtom)
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
