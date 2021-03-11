import {
	useEffect
} from "react";
const useIntersectionObserver = ({
	target: target,
	onIntersect: onIntersect,
	threshold: threshold = 0,
	rootMargin: rootMargin = "1000px"
}) => {
	if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
		useEffect(() => {
			if (target && target.current) {
				if ('IntersectionObserver' in window) {
					const observer = new IntersectionObserver(onIntersect, {
							rootMargin: rootMargin,
							threshold: threshold
						}),
						current = target.current;
					return observer.observe(current), () => {
						observer.unobserve(current)
					}
				}
				return null
			}
		}, [target])
		return true
	} else {
		return false
	}
};
export default useIntersectionObserver;