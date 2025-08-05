import { Cell } from "@/components/Cell"
import { tikTakToe } from "@/lib/tikTakToe"

export const Board = () => {
	return (
		<div
			className="grid w-64"
			style={{
				gridTemplateColumns: `repeat(${tikTakToe.Size}, minmax(0,1fr))`,
			}}
		>
			{Array.from({ length: tikTakToe.NbCells }, (_, index) => (
				<Cell key={index} index={index} />
			))}
		</div>
	)
}
