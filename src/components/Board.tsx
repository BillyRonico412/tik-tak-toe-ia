import { Cell } from "@/components/Cell"

export const Board = () => {
	return (
		<div className="grid grid-cols-3 w-64">
			{Array.from({ length: 9 }, (_, index) => (
				<Cell key={index} index={index} />
			))}
		</div>
	)
}
