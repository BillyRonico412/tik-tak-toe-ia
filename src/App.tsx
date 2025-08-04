import { useAtom } from "jotai"
import { Board } from "@/components/Board"
import { CurrentPlayer } from "@/components/CurrentPlayer"
import { ResetButton } from "@/components/ResetButton"
import { atoms } from "@/lib/atom"

export const App = () => {
	useAtom(atoms.aiPlayMoveEffect)
	return (
		<div className="container max-w-lg gap-4 mx-auto p-4 flex flex-col justify-center-safe items-center-safe min-h-screen">
			<h1 className="text-4xl font-black text-center">Tik Tak Toe</h1>
			<CurrentPlayer />
			<Board />
			<ResetButton />
		</div>
	)
}
