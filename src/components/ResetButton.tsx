import { useSetAtom } from "jotai"
import { LucideRefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { tikTakToe } from "@/lib/atom"

export const ResetButton = () => {
	const resetGame = useSetAtom(tikTakToe.resetGameAtom)
	return (
		<Button onClick={() => resetGame()}>
			<LucideRefreshCcw />
			Reset Game
		</Button>
	)
}
