export const routingEventsListeningTo = ['hashchange', 'popstate'];
import { reroute } from './reroute';

function urlReroute() {
	reroute([], arguments);
}

const captureEventListeners = {
	hashchange: [],
	popstate: [],
};

window.addEventListener('hashchange', urlReroute);
// popstate 当浏览器的活动历史记录条目更改时
window.addEventListener('popstate', urlReroute);

const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

window.addEventListener = function (eventName, fn) {
	if (
		routingEventsListeningTo.indexOf(eventName) > -1 &&
		!captureEventListeners[eventName].some(listener => listener == fn)
	) {
		captureEventListeners[eventName].push(fn);
		console.log('captureEventListeners: ', captureEventListeners);
		return;
	}
	return originalAddEventListener.apply(this, arguments);
};

window.removeEventListener = function (eventName, fn) {
	if (routingEventsListeningTo.indexOf(eventName) > -1) {
		captureEventListeners[eventName] = captureEventListeners[
			eventName
		].filter(l => l !== fn);
		return;
	}
	return originalRemoveEventListener.apply(this, arguments);
};

// function patchedUpdateState(updateState, methodName) {
// 	return function () {
// 		const urlBefore = window.location.href;
// 		updateState.apply(this, arguments);
// 		const urlAfter = window.location.href;
// 		if (urlBefore !== urlAfter) {
// 			urlReroute(new PopStateEvent('popstate'));
// 		}
// 	};
// }

// window.history.pushState = patchedUpdateState(
// 	window.history.pushState,
// 	'pushState'
// );
// window.history.replaceState = patchedUpdateState(
// 	window.history.replaceState,
// 	'replaceState'
// );
