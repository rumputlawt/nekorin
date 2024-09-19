import { define } from "../utils/core.ts";

export default define.page(({ Component }) => {
	return (
		<div class="w-dvw h-dvh bg-slate-100">
			<Component />
		</div>
	);
});
